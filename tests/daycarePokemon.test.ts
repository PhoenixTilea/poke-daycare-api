import DaycarePokemon from "../src/models/daycarePokemon";
import Pokemon from "../src/models/pokemon";

describe("DaycarePokemon", () => {
  describe("levelUpAndLearnMoves", () => {
    it("Should change the Pokemon's level.", () => {
      const species = new Pokemon(25, "Pikachu", true, true, true, [], "", []);
      const pokemon = new DaycarePokemon(1, species, 100, 1, []);

      expect(pokemon.level).toBe(1);

      const learnedMoves = pokemon.levelUpAndLearnMoves(5);
      expect(learnedMoves).toBe(false);
      expect(pokemon.level).toBe(5);
    });

    it("Should teach Pokemon new moves for new levels.", () => {
      const species = new Pokemon(25, "Pikachu", true, true, true, [], "", [
        { name: "tailwhip", levelLearned: 3 },
        { name: "new move 1", levelLearned: 4 },
        { name: "new move 2", levelLearned: 5 },
        { name: "shouldn't learn", levelLearned: 6 },
      ]);

      const pokemon = new DaycarePokemon(1, species, 0, 1, [
        "thundershock",
        "flash",
        "tailwhip",
      ]);

      const learnedMoves = pokemon.levelUpAndLearnMoves(5);
      expect(learnedMoves).toBe(true);
      expect(pokemon.moves).toEqual([
        "flash",
        "tailwhip",
        "new move 1",
        "new move 2",
      ]);
    });
  });

  describe("get name", () => {
    it.each([
      ["Ouch", "Ouch"],
      [null, "Pikachu"],
    ])(
      "Should return nickname when set and species name when not.",
      (nickname, expectedName) => {
        const species = new Pokemon(
          25,
          "Pikachu",
          true,
          true,
          true,
          [],
          "",
          [],
        );
        const pokemon = new DaycarePokemon(
          1,
          species,
          100,
          1,
          [],
          nickname,
          true,
        );

        expect(pokemon.name).toBe(expectedName);
      },
    );
  });

  describe("get isMale", () => {
    it.each([
      [false, false, true],
      [true, false, false],
      [false, true, false],
    ])(
      "Should return true only when Pokemon is not female or genderless.",
      (isFemale, isGenderless, shouldBeMale) => {
        const species = new Pokemon(
          0,
          "Blbadoo",
          !isGenderless,
          !isGenderless,
          !isGenderless,
          [],
          "",
          [],
        );
        const pokemon = new DaycarePokemon(
          1,
          species,
          100,
          1,
          [],
          null,
          isFemale,
        );

        expect(pokemon.isMale).toBe(shouldBeMale);
      },
    );
  });

  describe("canBreedWith", () => {
    const femaleOnlySpecies = new Pokemon(
      1,
      "",
      true,
      false,
      true,
      ["monster"],
      "",
      [],
    );
    const maleOnlySpecies = new Pokemon(
      1,
      "",
      false,
      true,
      true,
      ["monster"],
      "",
      [],
    );
    const incompatibleSpecies = new Pokemon(
      4,
      "",
      true,
      true,
      true,
      ["fairy"],
      "",
      [],
    );
    const dittoSpecies = new Pokemon(
      Pokemon.DITTO_ID,
      "Ditto",
      false,
      false,
      true,
      ["ditto"],
      "",
      [],
    );
    const genderlessSpecies = new Pokemon(
      2,
      "",
      false,
      false,
      true,
      ["monster"],
      "",
      [],
    );
    const noBreedingSpecies = new Pokemon(
      10,
      "",
      true,
      true,
      false,
      ["no-eggs"],
      "",
      [],
    );

    it.each([
      [femaleOnlySpecies, maleOnlySpecies],
      [femaleOnlySpecies, dittoSpecies],
      [dittoSpecies, maleOnlySpecies],
      [genderlessSpecies, dittoSpecies],
    ])(
      "Should return true for Pokemon that can breed.",
      (species1, species2) => {
        const pokemon1 = new DaycarePokemon(
          1,
          species1,
          100,
          1,
          [],
          "",
          species1.canBeFemale ? true : false,
        );
        const pokemon2 = new DaycarePokemon(2, species2, 100, 1, [], "", false);

        expect(pokemon1.canBreedWith(pokemon2)).toBe(true);
      },
    );

    it.each([
      [femaleOnlySpecies, incompatibleSpecies],
      [incompatibleSpecies, maleOnlySpecies],
      [genderlessSpecies, maleOnlySpecies],
      [femaleOnlySpecies, genderlessSpecies],
      [genderlessSpecies, genderlessSpecies],
      [dittoSpecies, noBreedingSpecies],
      [maleOnlySpecies, maleOnlySpecies],
    ])(
      "Should return false for incompatible Pokemon.",
      (species1, species2) => {
        const pokemon1 = new DaycarePokemon(
          1,
          species1,
          100,
          1,
          [],
          "",
          species1.canBeFemale ? true : false,
        );
        const pokemon2 = new DaycarePokemon(2, species2, 100, 1, [], "", false);

        expect(pokemon1.canBreedWith(pokemon2)).toBe(false);
      },
    );
  });
});
