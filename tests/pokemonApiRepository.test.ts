import axios from "axios";
import PokemonApiRepository from "../src/repositories/pokemonApiRepository";
import PokemonNotFoundError from "../src/errors/pokemonNotFoundError";
import PokemonOutOfRangeError from "../src/errors/pokemonOutOfRangeError";

jest.mock("axios");

describe("PokemonApiRepository", () => {
  const fakeAxios = jest.mocked(axios);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("getPokemon", () => {
    it("Should throw PokemonNotFoundError if species is not found.", async () => {
      fakeAxios.get.mockImplementation(() => {
        throw new Error("Fake error");
      });
      const repo = new PokemonApiRepository(fakeAxios);

      return expect(() => repo.getPokemon(123)).rejects.toThrow(new PokemonNotFoundError(123));
    });
    it("Should throw PokemonOutOfRangeError when returned Pokemon ID is greater than 251.", async () => {
      fakeAxios.get.mockImplementation(() => Promise.resolve({
        data: {
          id: 413,
          name: "wromadam"
        }
      }));
      const repo = new PokemonApiRepository(fakeAxios);

      return expect(() => repo.getPokemon("wormadam")).rejects.toThrow(new PokemonOutOfRangeError(413));
    });
    it("Should throw error from Axios if a Pokemon variety is not found.", async () => {
      fakeAxios.get.mockImplementation((path: string) => {
        if (path.includes("species")) {
          return Promise.resolve({
            data: {
              id: 25,
              name: "Pikachu",
              varieties: [{
                is_default: true,
                pokemon: {name: "Fake-Pikachu"}
              }]
            }
          });
        } else {
          throw new Error("Axios error");
        }
      });
      const repo = new PokemonApiRepository(fakeAxios);

      return expect(() => repo.getPokemon(25)).rejects.toThrow("Axios error");
    });
  });
});