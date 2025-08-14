import {Router} from "express";
import type {Container} from "inversify";
import StatusCodeError from "../errors/statusCodeError";
import {IPokemonService, pokemonServiceId, trainerServiceId} from "../contracts";
import authorizationMiddleware from "../middleware/authorizationMiddleware";
import {isCredentials, validateCredentials} from "./dtos/credentials";
import {isPokemonRegistration} from "./dtos/pokemonRegistration";
import type {AuthenticatedRequest} from "../auth";

const trainerRouter = (container: Container) => {
  const router = Router();

  router.post("/register", async (req, res, next) => {
    const creds = req.body;
    if (!isCredentials(creds)) {
      return next(new StatusCodeError("Username and password are required to register.", 400));
    }

    const validationError = validateCredentials(creds);
    if (validationError) {
      return next(new StatusCodeError(`Invalid credentials: ${validationError}.`, 400));
    }

    const service = container.get(trainerServiceId);
    try {
      await service.registerNewTrainer(creds.username, creds.password);
      res.status(201);
      return res.send(`Thanks for signing up with the POkemon Daycare, ${creds.username}!`);
    } catch (err) {
      return next(err);
    }
  });

  // Require authenticated requests for remaining routes
  router.use(authorizationMiddleware);

  router.post("/pokemon/register", async (req, res, next) => {
    const regData = req.body;
    if (!isPokemonRegistration(regData)) {
      return next(new StatusCodeError("Invalid Pokemon registration data.", 400));
    }

    const {username} = req as AuthenticatedRequest;
    const pokemonService: IPokemonService = container.get(pokemonServiceId);
    const registeredPokemon = await pokemonService.getTrainersPokemon(username);
    if (registeredPokemon.length >= 2) {
      return next(new StatusCodeError("Only up to 2 Pokemon can be registered at a time.", 400));
    }

    try {
      const newPokemon = await pokemonService.registerNewPokemon(username, regData.speciesId, regData.level, regData.moves, regData.nickname, regData.isFemale);
      res.status(201);
      res.json({
        registrationId: newPokemon.registrationId,
        message: `Great! We'll take good care of ${newPokemon.nickname ?? newPokemon.species.name}!`
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get("/pokemon/:registrationId", async (req, res, next) => {
    const {username} = ((req as unknown) as AuthenticatedRequest); // Ewww...
    const registrationId = parseInt(req.params.registrationId, 10);
    if (isNaN(registrationId) || registrationId < 1) {
      return next(new StatusCodeError("Invalid pokemon registration ID.", 400));
    }

    const pokemonService: IPokemonService = container.get(pokemonServiceId);
    const pokemon = await pokemonService.getTrainersPokemonById(username, registrationId);
    if (!pokemon) {
      return next(new StatusCodeError("Sorry, we don't have a pokemon registered under that ID for you.", 404));
    }

    const currentLevel = await pokemonService.getLevelForExp(pokemon.species.id, pokemon.experience);
    return res.json({
      registrationId,
      name: pokemon.nickname ?? pokemon.species.name,
      currentLevel,
      levelsGained: currentLevel - pokemon.levelAtRegistration
    });
  });

  router.get("/pokemon", async (req, res, next) => {
    const {username} = (req as AuthenticatedRequest);
    const pokemonService: IPokemonService = container.get(pokemonServiceId);
    try {
      const pokemon = await pokemonService.getTrainersPokemon(username);
      return res.json(pokemon.map(p => ({
        registrationId: p.registrationId,
        name: p.nickname ?? p.species.name
      })));
    } catch (err) {
      return next(err);
    }
  });

  return router;
}

export default trainerRouter;