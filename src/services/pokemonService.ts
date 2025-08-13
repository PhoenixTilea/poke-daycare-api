import {inject, injectable} from "inversify";
import {IPokemonApiRepository, pokemonApiRepositoryId} from "../contracts/iPokemonApiRepository";
import {IPokemonService} from "../contracts/iPokemonService";
import type Pokemon from "../models/pokemon";
import {ICachingService, cachingServiceId} from "../contracts/iCachingService";

const pokemonKeysFunc = (pokemon: Pokemon) => ([
  `pokemon_${pokemon.id}`,
  `pokemon_${pokemon.name}`
]);

@injectable()
export default class PokemonService implements IPokemonService {
  constructor(
    @inject(cachingServiceId)
    private readonly _cachingService: ICachingService,
    @inject(pokemonApiRepositoryId)
    private readonly _pokemonApiRepository: IPokemonApiRepository
  ) {}

  public getBaseExpForLevel = async (pokeId: number, level: number): Promise<number> => {
    const pokemon = await this.getPokemon(pokeId);
    const exp = await this.getExperienceFromCache(pokemon.growthRate);
    return exp[level - 1];
  }

  public getLevelForExp = async (pokeId: number, currentExp: number): Promise<number> => {
    const pokemon = await this.getPokemon(pokeId);
    const exp = await this.getExperienceFromCache(pokemon.growthRate);

    return exp.findIndex(e => e > currentExp) ?? 100;
  }

  public getPokemon = (pokeId: string | number): Promise<Pokemon> =>
    this.getPokemonFromCache(pokeId);

  public getPossiblePokemonMoves = async (pokeId: string | number): Promise<string[]> => {
    const pokemon = await this.getPokemonFromCache(pokeId);
    return pokemon.possibleMoves.map(m => m.name);
  }

  private getExperienceFromCache = (rate: string): Promise<number[]> => {
    const key = `rate_${rate}`;
    const payloadFunc = async () => await this._pokemonApiRepository.getExperiencePerLevel(rate);

    return this._cachingService.cached(key, payloadFunc);
  }

  private getPokemonFromCache = (pokeId: string | number): Promise<Pokemon> => {
    const key = `pokemon_${pokeId}`;
    const payloadFunc = async () => await this._pokemonApiRepository.getPokemon(pokeId);

    return this._cachingService.cached(key, payloadFunc, pokemonKeysFunc);
  }
}
