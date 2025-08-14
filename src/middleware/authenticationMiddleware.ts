import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../auth";
import type { Container } from "inversify";
import { ITrainerService, trainerServiceId } from "../contracts";

const authMiddlewareFactory = (container: Container) => {
  const trainerService: ITrainerService = container.get(trainerServiceId);

  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next();
    }

    const auth = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    const username = auth[0];
    const password = auth[1];
    if (!username || !password) {
      return next();
    }

    const isATrainer = await trainerService.authenticateTrainer(
      username,
      password,
    );
    if (isATrainer) {
      (req as AuthenticatedRequest).username = username;
      (req as AuthenticatedRequest).role = "trainer";
    }

    return next();
  };
};

export default authMiddlewareFactory;
