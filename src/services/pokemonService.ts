import {inject, injectable} from "inversify";
import {IPokemonApiRepository, pokemonApiRepositoryId} from "../contracts/iPokemonApiRepository";
import {IPokemonService} from "../contracts/iPokemonService";
import type Pokemon from "../models/pokemon";

@injectable()
export default class PokemonService implements IPokemonService {
  constructor(
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

  public getPokemon = (resId: string | number): Promise<Pokemon> =>
    this.getPokemonFromCache(resId);

  public getPossiblePokemonMoves = async (resId: string | number): Promise<string[]> => {
    const pokemon = await this.getPokemonFromCache(resId);
    return pokemon.possibleMoves.map(m => m.name);
  }

  private getExperienceFromCache = (rate: string): Promise<number[]> => {
    // TODO: Add caching
    return this._pokemonApiRepository.getExperiencePerLevel(rate);
  }

  private getPokemonFromCache = async (resId: string | number): Promise<Pokemon> => {
    // TODO: Add caching
    const pokemon = await this._pokemonApiRepository.getPokemon(resId);
    return pokemon;
  }
}
