import axios from "axios";
import { Container } from "inversify";
import Cache from "node-cache";
import type { DataSource } from "typeorm";
import {
  cachingServiceId,
  pokemonApiRepositoryId,
  pokemonRepositoryId,
  pokemonServiceId,
  trainerRepositoryId,
  trainerServiceId,
} from "./contracts";
import PokemonEntity from "./data/entities/pokemonEntity";
import TrainerEntity from "./data/entities/trainerEntity";
import PokemonApiRepository, {
  axiosClientId,
} from "./repositories/pokemonApiRepository";
import CachingService, { cacheId } from "./services/cachingService";
import PokemonService from "./services/pokemonService";
import TrainerService from "./services/trainerService";

const container = new Container();

container
  .bind(axiosClientId)
  .toConstantValue(axios.create({ baseURL: "https://pokeapi.co/api/v2" }));
container
  .bind(cacheId)
  .toConstantValue(new Cache({ checkperiod: 0, useClones: false }));

container.bind(cachingServiceId).to(CachingService).inSingletonScope();
container
  .bind(pokemonApiRepositoryId)
  .to(PokemonApiRepository)
  .inSingletonScope();
container.bind(pokemonServiceId).to(PokemonService).inSingletonScope();
container.bind(trainerServiceId).to(TrainerService).inSingletonScope();

export const bindDbRepositories = (dataSource: DataSource) => {
  container
    .bind(pokemonRepositoryId)
    .toConstantValue(dataSource.getRepository(PokemonEntity));
  container
    .bind(trainerRepositoryId)
    .toConstantValue(dataSource.getRepository(TrainerEntity));
};

export default container;
