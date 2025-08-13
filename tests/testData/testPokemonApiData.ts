import type {PokemonSpecies, PokemonVariety} from "../../src/repositories/pokemonApi";

export const blobadoo: PokemonSpecies = {
  id: 1,
  name: "Blobadoo", // It's like Ditto, but even more nebulous
  egg_groups: [{
    name: "monster"
  }],
  gender_rate: 4,
  growth_rate: {
    name: "slow"
  },
  is_baby: false,
  is_legendary: false,
  is_mythical: false,
  varieties: [{
    is_default: false,
    pokemon: {
      name: "Blobadont"
    }
  },
  {
    is_default: true,
    pokemon: {
      name: "Blobadoo"
    }
  }]
};

export const blobadooVariety: PokemonVariety = {
  id: 1,
  name: "Blobadoo",
  moves: [{
    move: {
      name: "Consume"
    },
    version_group_details: [{
      version_group: {
        name: "red-blue"
      },
      level_learned_at: 45,
      order: 4
    },
    {
      version_group: {
        name: "crystal"
      },
      level_learned_at: 0,
      order: null
    },
    {
      version_group: {
        name: "crystal"
      },
      level_learned_at: 40,
      order: 4
    }]
  }]
}

export const femaleOnlyBlobadoo = {
  ...blobadoo,
  gender_rate: 8
};
export const maleOnlyBlobadoo = {
  ...blobadoo,
  gender_rate: 0
};
export const genderlessBlobadoo = {
  ...blobadoo,
  gender_rate: -1
};
export const noEggsBlobadoo = {
  ...blobadoo,
  egg_groups: [{
    name: "no-eggs"
  }]
};
export const babyBlobadoo = {
  ...blobadoo,
  is_baby: true
};
export const legendaryBlobadoo = {
  ...blobadoo,
  is_legendary: true
};
export const mythicalBlobadoo = {
  ...blobadoo,
  is_mythical: true
};