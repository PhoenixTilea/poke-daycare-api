type NamedApiResource = { name: string };

export type PokemonSpecies = {
  egg_groups: NamedApiResource[];
  gender_rate: number;
  growth_rate: NamedApiResource;
  id: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
  varieties: { is_default: boolean; pokemon: NamedApiResource }[];
};

export type PokemonVariety = { id: number; name: string; moves: PokemonMove[] };

export type PokemonMove = {
  move: NamedApiResource;
  version_group_details: PokemonMoveVersion[];
};

export type GrowthRate = { levels: { experience: number }[] };

type PokemonMoveVersion = {
  level_learned_at: number;
  order: number | null;
  version_group: NamedApiResource;
};
