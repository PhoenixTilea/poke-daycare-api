import type {ServiceIdentifier} from "inversify";
import type {Repository} from "typeorm";
import type PokemonEntity from "../data/entities/pokemonEntity";
import type TrainerEntity from "../data/entities/trainerEntity";

export interface IPokemonRepository extends Repository<PokemonEntity> {};
export interface ITrainerRepository extends Repository<TrainerEntity> {};

export const pokemonRepositoryId: ServiceIdentifier<IPokemonRepository> = Symbol.for("PokemonRepositoryId");
export const trainerRepositoryId: ServiceIdentifier<ITrainerRepository> = Symbol.for("TrainerRepositoryId");