import bodyParser from "body-parser";
import express from "express";
// import {AppDataSource} from "./data/data-source";
import container from "./container";
import errorMiddleware from "./middleware/errorMiddleware";
import pokemonRouter from "./routers/pokemonRouter";

// AppDataSource.initialize().then(async () => {

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
// }).catch(console.error)
