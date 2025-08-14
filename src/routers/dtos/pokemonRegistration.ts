export type PokemonRegistration = {
  isFemale?: boolean;
  level: number;
  moves: string[];
  nickname?: string;
  speciesId: string | number;
};

export const isPokemonRegistration = (
  data: unknown,
): data is PokemonRegistration => {
  if (!data) {
    return false;
  }

  const reg = data as PokemonRegistration;
  return (
    ["string", "number"].includes(typeof reg.speciesId) &&
    typeof reg.level === "number" &&
    Array.isArray(reg.moves) &&
    (reg.isFemale === undefined || typeof reg.isFemale === "boolean") &&
    (reg.nickname === undefined || typeof reg.nickname === "string")
  );
};
