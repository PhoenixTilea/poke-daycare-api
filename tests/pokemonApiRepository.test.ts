import axios, { AxiosError } from "axios";
import { PokemonNotFoundError, PokemonOutOfRangeError } from "../src/errors";
import PokemonApiRepository from "../src/repositories/pokemonApiRepository";
import * as fakes from "./testData/testPokemonApiData";

jest.mock("axios");

describe("PokemonApiRepository", () => {
  const fakeAxios = jest.mocked(axios);
  const repo = new PokemonApiRepository(fakeAxios);

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("getPokemon", () => {
    it("Should build a basic Pokemon.", async () => {
      fakeAxios.get.mockImplementation((path: string) => {
        if (path.includes("species")) {
          return Promise.resolve({ data: fakes.blobadoo });
        } else {
          return Promise.resolve({ data: fakes.blobadooVariety });
        }
      });

      const result = await repo.getPokemon("blobadoo");
      expect(result.id).toBe(1);
      expect(result.name).toBe("Blobadoo");
      expect(result.canBeFemale).toBe(true);
      expect(result.canBeMale).toBe(true);
      expect(result.canBreed).toBe(true);
      expect(result.eggGroups).toEqual(["monster"]);
      expect(result.growthRate).toBe("slow");
      expect(result.possibleMoves).toHaveLength(1);
      expect(result.possibleMoves[0].levelLearned).toBe(40);
      expect(result.possibleMoves[0].name).toBe("Consume");
    });
    it.each([
      [fakes.femaleOnlyBlobadoo, true, false],
      [fakes.maleOnlyBlobadoo, false, true],
      [fakes.genderlessBlobadoo, false, false],
    ])(
      "Should set gender properties according to species.",
      async (blobadoo, canBeFemale, canBeMale) => {
        fakeAxios.get.mockImplementation((path: string) => {
          if (path.includes("species")) {
            return Promise.resolve({ data: blobadoo });
          }
          return Promise.resolve({ data: fakes.blobadooVariety });
        });

        const result = await repo.getPokemon(1);
        expect(result.canBeFemale).toBe(canBeFemale);
        expect(result.canBeMale).toBe(canBeMale);
      },
    );
    it.each([
      fakes.babyBlobadoo,
      fakes.legendaryBlobadoo,
      fakes.mythicalBlobadoo,
      fakes.noEggsBlobadoo,
    ])(
      "Should set baby, legendary, mythical, and 'no-egg' Pokemon as unable to breed.",
      async blobadoo => {
        fakeAxios.get.mockImplementation((path: string) => {
          if (path.includes("species")) {
            return Promise.resolve({ data: blobadoo });
          }
          return Promise.resolve({ data: fakes.blobadooVariety });
        });

        const result = await repo.getPokemon(1);
        expect(result.canBreed).toBe(false);
      },
    );

    // Errors
    it("Should throw PokemonNotFoundError if species is not found.", async () => {
      fakeAxios.get.mockImplementation(() => {
        const err = new AxiosError("Fake error");
        err.status = 404;
        throw err;
      });

      return expect(() => repo.getPokemon(123)).rejects.toThrow(
        new PokemonNotFoundError(123),
      );
    });
    it("Should throw PokemonOutOfRangeError when returned Pokemon ID is greater than 251.", async () => {
      fakeAxios.get.mockImplementation(() =>
        Promise.resolve({ data: { id: 413, name: "wromadam" } }),
      );

      return expect(() => repo.getPokemon("wormadam")).rejects.toThrow(
        new PokemonOutOfRangeError(413),
      );
    });
    it("Should throw error from Axios if a Pokemon variety is not found.", async () => {
      fakeAxios.get.mockImplementation((path: string) => {
        if (path.includes("species")) {
          return Promise.resolve({
            data: {
              id: 25,
              name: "Pikachu",
              varieties: [
                { is_default: true, pokemon: { name: "Fake-Pikachu" } },
              ],
            },
          });
        } else {
          throw new Error("Axios error");
        }
      });

      return expect(() => repo.getPokemon(25)).rejects.toThrow("Axios error");
    });
  });
});
