import type PokemonMove from "./pokemonMove";

export default class Pokemon {
  static readonly DITTO_ID = 132;

  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly canBeFemale: boolean,
    public readonly canBeMale: boolean,
    public readonly canBreed: boolean,
    public readonly eggGroups: string[],
    public readonly growthRate: string,
    public readonly possibleMoves: PokemonMove[],
  ) {}

  get isDitto() {
    return this.id === Pokemon.DITTO_ID;
  }

  get isGenderless() {
    return !this.canBeFemale && !this.canBeMale;
  }

  public canBreedWithSpecies = (other: Pokemon): boolean => {
    if (!this.canBreed || !other.canBreed) {
      return false;
    } else if (this.isDitto || other.isDitto) {
      return true;
    } else if (this.isGenderless || other.isGenderless) {
      return false;
    } else if (!this.eggGroups.some(g => other.eggGroups.includes(g))) {
      return false;
    }

    return (
      (this.canBeFemale && other.canBeMale) ||
      (this.canBeMale && other.canBeFemale)
    );
  };

  public movesLearnedAtLevel = (level: number): PokemonMove[] =>
    this.possibleMoves.filter(m => m.levelLearned === level);
}
