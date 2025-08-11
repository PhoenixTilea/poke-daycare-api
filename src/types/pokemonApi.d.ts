type NamedResourcePointer = {
  name: string;
  url: string;
}

export type PokemonSpecies = {
  egg_groups: NamedResourcePointer[];
  evolves_from_species: NamedResourcePointer | null;
  gender_rate: number;
  id: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
  varieties: {
    is_default: boolean;
    pokemon: NamedResourcePointer;
  }[];
}

export type PokemonVariety = {
  id: number;
  name: string;
  moves: PokemonMove[];
};

type PokemonMove = {
  move: NamedResourcePointer;
  version_group_details: PokemonMoveVersion[];
}

type PokemonMoveVersion = {
  level_learned_at: number;
  move_learn_method: NamedResourcePointer;
  order: number | null;
}
