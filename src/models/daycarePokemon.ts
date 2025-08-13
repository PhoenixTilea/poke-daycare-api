import type Pokemon from "./pokemon";
import type PokemonMove from "./pokemonMove";

export default class DaycarePokemon {
  constructor(
    public readonly registrationId: number,
    public readonly species: Pokemon,
    private _experience: number,
    public readonly levelAtRegistration: number,
    private _moves: string[] = [],
    public readonly nickname: string | null = null,
    public readonly isFemale: boolean = false,
  ) {}

  get experience() {
    return this._experience;
  }

  get isMale() {
    return !this.species.isGenderless && !this.isFemale;
  }

  get moves() {
    return [...this._moves];
  }

  public canBreedWith = (other: DaycarePokemon): boolean => {
    if (!this.species.canBreedWithSpecies(other.species)) {
      return false;
    } else if (this.species.isDitto || other.species.isDitto) {
      return true;
    }

    return (this.isFemale && other.isMale)
      || (this.isMale && other.isFemale);
  }

  public gainExperience = (exp: number): number => {
    this._experience += exp;
    return this._experience;
  }

  public tryLearnMovesAfterLevelUp = (prevLevel: number, currentLevel: number): boolean => {
    const movesToLearn = this.species.possibleMoves.filter(m => (
      m.levelLearned > prevLevel && m.levelLearned <= currentLevel
    ));
    if (movesToLearn.length === 0) {
      return false;
    }

    const currentMoves = this.moves;
    for (const newMove of movesToLearn) {
      if (currentMoves.includes(newMove.name)) {
        continue;
      }
      if (currentMoves.length === 4) {
        currentMoves.shift();
      }
      currentMoves.push(newMove.name);
    }

    this._moves = currentMoves;
    return true;
  }
}
