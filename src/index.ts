import bodyParser from "body-parser";
import express from "express";
import container, {bindDbRepositories} from "./container";
import {AppDataSource} from "./data/dataSource";
import errorMiddleware from "./middleware/errorMiddleware";
import pokemonRouter from "./routers/pokemonRouter";

AppDataSource.initialize().then(async () => {
  bindDbRepositories(AppDataSource);

  // create express app
  const app = express();
  app.use(bodyParser.json());

  // Add routes
  app.use("/api/pokemon", pokemonRouter(container));

  // Catch errors
  app.use(errorMiddleware);

  // start express server
  const port = process.env.PORT ?? 3000;
  app.listen(port, () => console.log("Now listening on port 3000"));
}).catch(console.error)
