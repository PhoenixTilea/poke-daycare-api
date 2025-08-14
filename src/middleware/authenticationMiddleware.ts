import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../auth";
import type { Container } from "inversify";
import { ITrainerService, trainerServiceId } from "../contracts";

const authMiddlewareFactory = (container: Container) => {
  const trainerService: ITrainerService = container.get(trainerServiceId);

  return async (req: Request, res: Response, next: NextFunction) => {
    const username = req.get("username");
    const password = req.get("password");
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
