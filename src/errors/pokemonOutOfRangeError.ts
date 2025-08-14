import StatusCodeError from "./statusCodeError";

export default class PokemonOutOfRangeError extends StatusCodeError {
  constructor(pokeId: number) {
    super(`Sorry, pokemon with ID ${pokeId} is not allowed. only Pokemon 1 through 251 are allowed.`, 400);
  }
}
