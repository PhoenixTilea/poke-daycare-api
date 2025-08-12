import {ServiceIdentifier} from "inversify";
import type Pokemon from "../models/pokemon";

export interface IPokemonApiRepository {
  getPokemon(resId: string | number): Promise<Pokemon>;
}

export const pokemonApiRepositoryId: ServiceIdentifier<IPokemonApiRepository> = Symbol.for("PokemonApiRepositoryId");