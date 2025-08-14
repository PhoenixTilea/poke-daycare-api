import StatusCodeError from "./statusCodeError";

export default class PokemonNotFoundError extends StatusCodeError {
  constructor(pokeId: string | number) {
    const identifierType = typeof pokeId === "number" ? "ID" : "name";
    super(`Pokemon with ${identifierType} ${pokeId} could not be found.`, 404);
  }
}
