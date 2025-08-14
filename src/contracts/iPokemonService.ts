import type { ServiceIdentifier } from "inversify";
import type DaycarePokemon from "../models/daycarePokemon";
import type Pokemon from "../models/pokemon";

export type PokemonPickupInfo = { pokemon: DaycarePokemon; message: string };

export interface IPokemonService {
  getBaseExpForLevel(pokeId: number, level: number): Promise<number>;
  getLevelForExp(pokeId: number, currentExp: number): Promise<number>;
  getPokemon(pokeId: string | number): Promise<Pokemon>;
  getPossiblePokemonMoves(pokeId: string | number): Promise<string[]>;
  getTrainersPokemon(username: string): Promise<DaycarePokemon[]>;
  getTrainersPokemonById(
    username: string,
    registrationId: number,
  ): Promise<DaycarePokemon | null>;
  registerNewPokemon(
    username: string,
    pokeId: string | number,
    level: number,
    moves: string[],
    nickname?: string,
    isFemale?: boolean,
  ): Promise<DaycarePokemon>;
  pickUpPokemon(
    username: string,
    registrationId: number,
  ): Promise<PokemonPickupInfo>;
}

export const pokemonServiceId: ServiceIdentifier<IPokemonService> =
  Symbol.for("PokemonServiceId");
