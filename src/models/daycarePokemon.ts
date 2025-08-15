import type Pokemon from "./pokemon";

export default class DaycarePokemon {
  private _level: number;

  constructor(
    public readonly registrationId: number,
    public readonly species: Pokemon,
    public readonly experience: number,
    public readonly levelAtRegistration: number,
    private _moves: string[] = [],
    public readonly nickname: string | null = null,
    public readonly isFemale: boolean = false,
  ) {
    this._level = levelAtRegistration;
  }

  get isMale() {
    return !this.species.isGenderless && !this.isFemale;
  }

  get level() {
    return this._level;
  }

  get moves() {
    return [...this._moves];
  }

  get name() {
    return this.nickname ?? this.species.name;
  }

  public canBreedWith = (other: DaycarePokemon): boolean => {
    if (!this.species.canBreedWithSpecies(other.species)) {
      return false;
    } else if (this.species.isDitto || other.species.isDitto) {
      return true;
    }

    return (this.isFemale && other.isMale) || (this.isMale && other.isFemale);
  };

  public levelUpAndLearnMoves = (level: number): boolean => {
    if (level > this._level) {
      this._level = level;
      return this.tryLearnMovesAfterLevelUp(this.levelAtRegistration, level);
    }
    return false;
  };

  private tryLearnMovesAfterLevelUp = (
    prevLevel: number,
    currentLevel: number,
  ): boolean => {
    const movesToLearn = this.species.possibleMoves.filter(
      m => m.levelLearned > prevLevel && m.levelLearned <= currentLevel,
    );
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
  };
}
