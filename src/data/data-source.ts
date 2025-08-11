import "reflect-metadata"
import {DataSource} from "typeorm"
import Pokemon from "./entities/pokemon";
import Trainer from "./entities/trainer";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [Pokemon, Trainer],
    migrations: [],
    subscribers: [],
});
