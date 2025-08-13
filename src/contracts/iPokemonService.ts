import {ServiceIdentifier} from "inversify";
import type Pokemon from "../models/pokemon";

export interface IPokemonService {
  getBaseExpForLevel(pokeId: number, level: number): Promise<number>;
  getLevelForExp(pokeId: number, currentExp: number): Promise<number>;
  getPokemon(pokeId: string | number): Promise<Pokemon>;
  getPossiblePokemonMoves(pokeId: string | number): Promise<string[]>;
}

export const pokemonServiceId: ServiceIdentifier<IPokemonService> = Symbol.for("PokemonServiceId");