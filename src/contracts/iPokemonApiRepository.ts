import {ServiceIdentifier} from "inversify";
import type Pokemon from "../models/pokemon";

export interface IPokemonApiRepository {
  getExperiencePerLevel(rate: string): Promise<number[]>;
  getPokemon(pokeId: string | number): Promise<Pokemon>;
}

export const pokemonApiRepositoryId: ServiceIdentifier<IPokemonApiRepository> = Symbol.for("PokemonApiRepositoryId");