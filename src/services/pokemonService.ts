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

  public getPokemon = (resId: string | number): Promise<Pokemon> =>
    this.getPokemonFromCache(resId);

  public getPossiblePokemonMoves = async (resId: string | number): Promise<string[]> => {
    const pokemon = await this.getPokemonFromCache(resId);
    return pokemon.possibleMoves.map(m => m.name);
  }

  private getPokemonFromCache = async (resId: string | number): Promise<Pokemon> => {
    // TODO: Add caching
    const pokemon = await this._pokemonApiRepository.getPokemon(resId);
    return pokemon;
  }
}
