type NamedApiResource = {
  name: string;
  url: string;
}

export type PokemonSpecies = {
  egg_groups: NamedApiResource[];
  evolves_from_species: NamedApiResource | null;
  gender_rate: number;
  id: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
  varieties: {
    is_default: boolean;
    pokemon: NamedApiResource;
  }[];
}

export type PokemonVariety = {
  id: number;
  name: string;
  moves: PokemonMove[];
};

export type PokemonMove = {
  move: NamedApiResource;
  version_group_details: PokemonMoveVersion[];
}

type PokemonMoveVersion = {
  level_learned_at: number;
  order: number | null;
  version_group: NamedApiResource;
}
