import type {ServiceIdentifier} from "inversify";
import type Pokemon from "../models/pokemon";
import type DaycarePokemon from "../models/daycarePokemon";

export interface IPokemonService {
  getBaseExpForLevel(pokeId: number, level: number): Promise<number>;
  getLevelForExp(pokeId: number, currentExp: number): Promise<number>;
  getPokemon(pokeId: string | number): Promise<Pokemon>;
  getPossiblePokemonMoves(pokeId: string | number): Promise<string[]>;
  getTrainersPokemon(trainer: string): Promise<DaycarePokemon[]>;
  registerNewPokemon(username: string, pokeId: string | number, level: number, moves: string[], nickname?: string, isFemale?: boolean): Promise<DaycarePokemon>;
}

export const pokemonServiceId: ServiceIdentifier<IPokemonService> = Symbol.for("PokemonServiceId");