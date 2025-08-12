import axios from "axios";
import {Container} from "inversify";
import {pokemonApiRepositoryId} from "./contracts/iPokemonApiRepository";
import {pokemonServiceId} from "./contracts/iPokemonService";
import PokemonApiRepository, {axiosClientId} from "./repositories/pokemonApiRepository";
import PokemonService from "./services/pokemonService";

const container = new Container();

container.bind(axiosClientId)
  .toConstantValue(axios.create({
    baseURL: "https://pokeapi.co/api/v2"
  }));
container.bind(pokemonApiRepositoryId)
  .to(PokemonApiRepository)
  .inSingletonScope();
container.bind(pokemonServiceId)
  .to(PokemonService)
  .inSingletonScope();

export default container;