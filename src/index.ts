import * as express from "express";
import * as bodyParser from "body-parser";
// import {AppDataSource} from "./data/data-source";
import errorMiddleware from "./middleware/errorMiddleware";
import pokemonRouter from "./routers/pokemonRouter";
import container from "./container";

// AppDataSource.initialize().then(async () => {

// create express app
const app = express();
app.use(bodyParser.json());

// Add routes
app.use("/api/pokemon", pokemonRouter(container));

// Catch errors
app.use(errorMiddleware);

// start express server
app.listen(3000, () => "Now listening on port 3000");
// }).catch(console.error)
