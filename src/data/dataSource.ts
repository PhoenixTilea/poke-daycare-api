import { DataSource } from "typeorm";
import PokemonEntity from "./entities/pokemonEntity";
import TrainerEntity from "./entities/trainerEntity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: false,
  logging: false,
  entities: [PokemonEntity, TrainerEntity],
  migrations: [],
  subscribers: [],
});
