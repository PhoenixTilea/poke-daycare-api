import { Router } from "express";
import type { Container } from "inversify";
import { pokemonServiceId } from "../contracts/iPokemonService";
import PokemonOutOfRangeError from "../errors/pokemonOutOfRangeError";

const pokemonRouterFactory = (container: Container) => {
  const router = Router();

  router.get("/:pokeId(\\d{1,3}|[a-zA-Z]+)", async (req, res, next) => {
    const pokeId = req.params["pokeId"];
    const validatedOrError = validatePokemonId(pokeId);
    if (validatedOrError instanceof Error) {
      return next(validatedOrError);
    }

    const pokemonService = container.get(pokemonServiceId);

    try {
      const pokemon = await pokemonService.getPokemon(validatedOrError);
      return res.json({
        Id: pokemon.id,
        name: pokemon.name,
        canBeFemale: pokemon.canBeFemale,
        canBeMale: pokemon.canBeMale,
        isGenderless: pokemon.isGenderless,
        canBreed: pokemon.canBreed,
        eggGroups: pokemon.eggGroups,
        possibleMoves: pokemon.possibleMoves.map(m => ({
          name: m.name,
          learnedAtLevel: m.levelLearned > 0 ? m.levelLearned : null,
        })),
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};

const validatePokemonId = (id: string): string | number | Error => {
  const asNumber = parseInt(id, 10);
  if (!isNaN(asNumber)) {
    if (asNumber < 1 || asNumber > 251) {
      return new PokemonOutOfRangeError(asNumber);
    }
    return asNumber;
  }

  return id;
};

export default pokemonRouterFactory;
