import { inject, injectable } from "inversify";
import type {
  ICachingService,
  IPokemonApiRepository,
  IPokemonRepository,
  IPokemonService,
  ITrainerRepository,
  PokemonPickupInfo,
} from "../contracts";
import {
  cachingServiceId,
  pokemonApiRepositoryId,
  pokemonRepositoryId,
  trainerRepositoryId,
} from "../contracts";
import type PokemonEntity from "../data/entities/pokemonEntity";
import { StatusCodeError } from "../errors";
import DaycarePokemon from "../models/daycarePokemon";
import type Pokemon from "../models/pokemon";

const pokemonKeysFunc = (pokemon: Pokemon) => [
  `pokemon_${pokemon.id}`,
  `pokemon_${pokemon.name}`,
];

@injectable()
export default class PokemonService implements IPokemonService {
  constructor(
    @inject(cachingServiceId)
    private readonly _cachingService: ICachingService,
    @inject(pokemonApiRepositoryId)
    private readonly _pokemonApiRepository: IPokemonApiRepository,
    @inject(pokemonRepositoryId)
    private readonly _pokemonRepository: IPokemonRepository,
    @inject(trainerRepositoryId)
    private readonly _trainerRepository: ITrainerRepository,
  ) {}

  public getBaseExpForLevel = async (
    pokeId: number,
    level: number,
  ): Promise<number> => {
    const pokemon = await this.getPokemon(pokeId);
    const exp = await this.getExperienceFromCache(pokemon.growthRate);
    return exp[level - 1];
  };

  public getLevelForExp = async (
    pokeId: number,
    currentExp: number,
  ): Promise<number> => {
    const pokemon = await this.getPokemon(pokeId);
    const exp = await this.getExperienceFromCache(pokemon.growthRate);

    return exp.findIndex(e => e > currentExp) ?? 100;
  };

  public getPokemon = (pokeId: string | number): Promise<Pokemon> =>
    this.getPokemonFromCache(pokeId);

  public getPossiblePokemonMoves = async (
    pokeId: string | number,
  ): Promise<string[]> => {
    const pokemon = await this.getPokemonFromCache(pokeId);
    return pokemon.possibleMoves.map(m => m.name);
  };

  public getTrainersPokemon = async (
    username: string,
  ): Promise<DaycarePokemon[]> => {
    const entities = await this._pokemonRepository.findBy({
      trainer: { username },
    });
    if (entities.length === 0) {
      return [];
    }

    const pokemon: DaycarePokemon[] = [];
    for (const e of entities) {
      const mapped = await this.mapDaycarePokemonFromEntity(e);
      pokemon.push(mapped);
    }

    return pokemon;
  };

  public getTrainersPokemonById = async (
    username: string,
    registrationId: number,
  ): Promise<DaycarePokemon | null> => {
    const entity = await this._pokemonRepository.findOneBy({
      registrationId,
      trainer: { username },
    });

    return entity ? this.mapDaycarePokemonFromEntity(entity) : null;
  };

  public registerNewPokemon = async (
    username: string,
    pokeId: string | number,
    level: number,
    moves: string[],
    nickname?: string,
    isFemale?: boolean,
  ): Promise<DaycarePokemon> => {
    const species = await this.getPokemonFromCache(pokeId);

    // Validate level
    if (level < 1 || level > 100) {
      throw new StatusCodeError(
        "Pokemon level must be between 1 and 100.",
        400,
      );
    }

    // Validate move list
    if (moves.length < 1 || moves.length > 4) {
      throw new StatusCodeError("A pokemon must have from 1 to 4 moves.", 400);
    }
    const validMoves = species.possibleMoves.map(m => m.name);
    const invalidMoves = moves.filter(m => !validMoves.includes(m));
    if (invalidMoves.length > 0) {
      throw new StatusCodeError(
        `${species.name} cannot learn the following move(s): ${invalidMoves.join(", ")}.`,
        400,
      );
    }

    // Validate gender
    if (isFemale && !species.canBeFemale) {
      throw new StatusCodeError(`${species.name} cannot be female.`, 400);
    } else if (!isFemale && !species.canBeMale && !species.isGenderless) {
      throw new StatusCodeError(`${species.name} can only be female.`, 400);
    }

    // Good enough!
    const trainer = await this._trainerRepository.findOneByOrFail({ username });
    const newPokemon = await this._pokemonRepository.create({
      pokemonId: species.id,
      nickname,
      exp: await this.getBaseExpForLevel(species.id, level),
      levelAtRegistration: level,
      isFemale: isFemale ?? false,
      moves,
      trainer,
    });
    trainer.registeredPokemon = trainer.registeredPokemon
      ? [...trainer.registeredPokemon, newPokemon]
      : [newPokemon];
    await this._pokemonRepository.save(newPokemon);
    await this._trainerRepository.save(trainer);

    return this.mapDaycarePokemonFromEntity(newPokemon);
  };

  public pickUpPokemon = async (
    username: string,
    registrationId: number,
  ): Promise<PokemonPickupInfo> => {
    const allPokemon = await this.getTrainersPokemon(username);

    const pokemon = allPokemon.find(p => p.registrationId === registrationId);
    if (!pokemon) {
      throw new StatusCodeError(
        `You don't have a Pokemon with registration ID ${registrationId} checked in with us.`,
        404,
      );
    }

    const level = await this.getLevelForExp(
      pokemon.species.id,
      pokemon.experience,
    );
    const hasLearnedMoves = pokemon.levelUpAndLearnMoves(level);

    let hasAnEgg = false;
    const otherPokemon = allPokemon.find(p => p !== pokemon);
    if (otherPokemon && pokemon.canBreedWith(otherPokemon)) {
      const eggChance =
        pokemon.species.id === otherPokemon.species.id ? 50 : 20;

      // Normally this would be calculated every 256 steps, but Ima make it simpler for now
      const random = Math.random() * 99;
      if (random < eggChance) {
        hasAnEgg = true;
      }
    }

    const message = this.generatePickupMessage(
      pokemon,
      hasLearnedMoves,
      hasAnEgg,
    );

    await this._pokemonRepository.delete(registrationId);
    return { pokemon, message };
  };

  private generatePickupMessage = (
    pokemon: DaycarePokemon,
    hasLearnedMoves: boolean,
    hasAnEgg: boolean,
  ): string => {
    const levelsGained = pokemon.level - pokemon.levelAtRegistration;
    let message = `${pokemon.name} looks happy to see you `;
    if (levelsGained > 0) {
      message += `and has grown by ${levelsGained} level${levelsGained > 1 ? "s" : ""}! `;
      if (hasLearnedMoves) {
        message += "It has even learned some new moves!";
      }
    } else {
      message += ` but hasn't grown much.`;
    }

    if (hasAnEgg) {
      message +=
        " Oh, and we found your pokemon holding this egg. Hope you're ready for parenthood!";
    }

    return message;
  };

  private getExperienceFromCache = (rate: string): Promise<number[]> => {
    const key = `rate_${rate}`;
    const payloadFunc = async () =>
      await this._pokemonApiRepository.getExperiencePerLevel(rate);

    return this._cachingService.cached(key, payloadFunc);
  };

  private getPokemonFromCache = (pokeId: string | number): Promise<Pokemon> => {
    const key = `pokemon_${pokeId}`;
    const payloadFunc = async () =>
      await this._pokemonApiRepository.getPokemon(pokeId);

    return this._cachingService.cached(key, payloadFunc, pokemonKeysFunc);
  };

  private mapDaycarePokemonFromEntity = async (
    entity: PokemonEntity,
  ): Promise<DaycarePokemon> => {
    const species = await this.getPokemonFromCache(entity.pokemonId);
    return new DaycarePokemon(
      entity.registrationId,
      species,
      entity.exp,
      entity.levelAtRegistration,
      entity.moves,
      entity.nickname,
      entity.isFemale,
    );
  };
}
