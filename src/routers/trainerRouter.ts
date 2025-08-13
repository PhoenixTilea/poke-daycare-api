import {Router} from "express";
import type {Container} from "inversify";
import StatusCodeError from "../errors/statusCodeError";
import {ITrainerService, trainerServiceId} from "../contracts";

type Credentials = {
  username: string;
  password: string;
};

const trainerRouter = (container: Container) => {
  const router = Router();

  router.post("/register", async (req, res, next) => {
    const creds = req.body;
    if (!isCredentials(creds)) {
      return next(new StatusCodeError("Username and password are required to register.", 400));
    }

    const validationError = validateCredentials(creds);
    if (validationError) {
      return next(new StatusCodeError(`Invalid credentials: ${validationError}.`, 400));
    }

    const service: ITrainerService = container.get(trainerServiceId);
    try {
      await service.registerNewTrainer(creds.username, creds.password);
      res.status(201);
      return res.send(`Thanks for signing up with the POkemon Daycare, ${creds.username}!`);
    } catch (err) {
      return next(err);
    }
  });

  return router;
}

const isCredentials = (creds: unknown): creds is Credentials => {
  return typeof (creds as Credentials)?.username === "string"
    && typeof (creds as Credentials)?.password === "string";
}

const validateCredentials = (creds: Credentials): string | null => {
  const usernameRegex = /^[a-zA-Z0-9_]{8, 20}$/;
  if (!usernameRegex.test(creds.username)) {
    return "Username must be between 8 and 20 characters long and container only letters, numbers, and underscores.";
  }

  const passwordRegex = /^[a-zA-Z0-9_$@!]{8, 20}$/;
  if (!passwordRegex.test(creds.password)) {
    return "Password must be between 8 and 20 characters and can only container letters, number, and the special characters _, $, @, and !.";
  }

  return null;
}

export default trainerRouter;