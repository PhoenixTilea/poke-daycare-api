import type {ServiceIdentifier} from "inversify";
import type {Repository} from "typeorm";
import type PokemonEntity from "../data/entities/pokemonEntity";
import type TrainerEntity from "../data/entities/trainerEntity";

export const pokemonRepositoryId: ServiceIdentifier<Repository<PokemonEntity>> = Symbol.for("PokemonRepositoryId");
export const trainerRepositoryId: ServiceIdentifier<Repository<TrainerEntity>> = Symbol.for("TrainerRepositoryId");