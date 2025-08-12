import Axios, {AxiosInstance} from "axios";
import {injectable} from "inversify";
import {IPokemonApiRepository} from "../contracts/iPokemonApiRepository";
import PokemonNotFoundError from "../errors/pokemonNotFoundError";
import PokemonOutOfRangeError from "../errors/pokemonOutOfRangeError";
import Pokemon from "../models/pokemon";
import PokemonMove from "../models/pokemonMove";
import type {GrowthRate, PokemonMove as ApiPokemonMove, PokemonSpecies, PokemonVariety} from "./pokemonApi";

@injectable()
export default class PokemonApiRepository implements IPokemonApiRepository {
  private _client: AxiosInstance;

  constructor() {
    this._client = Axios.create({
      baseURL: "https://pokeapi.co/api/v2"
    });
  }

  public getPokemon = async (resId: string | number): Promise<Pokemon> => {
    let species: PokemonSpecies;

    try {
      species = await this.getPokemonSpecies(resId);

      // Accounts for a name being passed in, since we don't know its number until we fetch it.
      if (species.id > 251) {
        throw new PokemonOutOfRangeError(species.id);
      }
    } catch (err) {
      console.error(err);
      throw new PokemonNotFoundError(resId);
    }

    // For simplicity's sake, we're sticking with a "default" variety
    const defaultVariety = species.varieties.find(v => v.is_default) ?? species.varieties[0];
    const variety = await this.getPokemonVariety(defaultVariety.pokemon.name);

    const moves = this.filterAndMapMoves(variety.moves);

    const eggGroups = species.egg_groups.some(g => g.name === "no-eggs")
      ? []
      : species.egg_groups.map(g => g.name);
    const canBreed = !(species.is_baby || species.is_legendary || species.is_mythical || eggGroups.length === 0);

    return new Pokemon(
      species.id,
      species.name,
      species.gender_rate > 0,
      species.gender_rate > -1 && species.gender_rate < 8,
      canBreed,
      eggGroups,
      species.growth_rate.name,
      moves
    );
  }

  public getExperiencePerLevel = async (rate: string): Promise<number[]> => {
    const growthRate = await this.getGrowthRate(rate);
    const exp = growthRate.levels.map(l => l.experience);
    exp.sort();
    return exp;
  }

  // Raw Resource Getters
  private getGrowthRate = async (rate: string): Promise<GrowthRate> => {
    const res = await this._client.get(`/growth-rate/${rate}`);
    return res.data;
  }

  private getPokemonSpecies = async (resId: string | number): Promise<PokemonSpecies> => {
    const res = await this._client.get<PokemonSpecies>(`pokemon-species/${resId}`);
    return res.data;
  }

  private getPokemonVariety = async (name: string): Promise<PokemonVariety> => {
    const res = await this._client.get(`pokemon/${name}`);
    return res.data;
  }

  // Helpers

  // For my sanity, picking my favorite version and sticking with it!
  private filterAndMapMoves = (apiMoves: ApiPokemonMove[]): PokemonMove[] => {
    const moves: Record<string, PokemonMove> = {};
    for (const m of apiMoves) {
      const version = m.version_group_details.find(v => v.version_group.name === "crystal");
      if (!version) {
        continue;
      }

      // We don't need to know all the different ways a move can be learned,
      // only that it can be and at what level - if any.
      const existingMove = moves[m.move.name];
      if (!existingMove || version.level_learned_at > existingMove.levelLearned) {
        moves[m.move.name] = new PokemonMove(m.move.name, version.level_learned_at, version.order);
      }
    }

    return Array.from(Object.values(moves));
  }
}
