import "reflect-metadata";
import { AppDataSource } from "./data/dataSource";
import bodyParser from "body-parser";
import express from "express";
import container, { bindDbRepositories } from "./container";
import authMiddleware from "./middleware/authenticationMiddleware";
import errorMiddleware from "./middleware/errorMiddleware";
import pokemonRouterFactory from "./routers/pokemonRouter";
import trainerRouterFactory from "./routers/trainerRouter";

AppDataSource.initialize()
  .then(async () => {
    bindDbRepositories(AppDataSource);

    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(authMiddleware(container));

    // Add routes
    app.use("/api/pokemon", pokemonRouterFactory(container));
    app.use("/api/trainer", trainerRouterFactory(container));

    // Catch errors
    app.use(errorMiddleware);

    // start express server
    const port = process.env.PORT ?? 3000;
    app.listen(port, () => console.log("Now listening on port 3000"));
  })
  .catch(console.error);
