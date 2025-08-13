import axios from "axios";
import {Container} from "inversify";
import Cache from "node-cache";
import {cachingServiceId} from "./contracts/iCachingService";
import {pokemonApiRepositoryId} from "./contracts/iPokemonApiRepository";
import {pokemonServiceId} from "./contracts/iPokemonService";
import PokemonApiRepository, {axiosClientId} from "./repositories/pokemonApiRepository";
import CachingService, {cacheId} from "./services/cachingService";
import PokemonService from "./services/pokemonService";

const container = new Container();

container.bind(axiosClientId)
  .toConstantValue(axios.create({
    baseURL: "https://pokeapi.co/api/v2"
  }));
container.bind(cacheId)
  .toConstantValue(new Cache({
    checkperiod: 0,
    useClones: false
  }));

container.bind(cachingServiceId)
  .to(CachingService)
  .inSingletonScope();
container.bind(pokemonApiRepositoryId)
  .to(PokemonApiRepository)
  .inSingletonScope();
container.bind(pokemonServiceId)
  .to(PokemonService)
  .inSingletonScope();

export default container;