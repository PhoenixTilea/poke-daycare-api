import * as express from "express";
import * as bodyParser from "body-parser";
import {AppDataSource} from "./data/data-source";

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    // start express server
    app.listen(3000, () => "Now listening on port 3000");
}).catch(error => console.log(error))
