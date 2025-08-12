export default class PokemonMove {
  constructor(
    public readonly name: string,
    public readonly levelLearned: number,
    public readonly order: number | null
  ) {}
}
