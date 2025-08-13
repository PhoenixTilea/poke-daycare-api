import type {Request, Response, NextFunction} from "express";
import {isAuthenticatedRequest} from "../auth";

const authorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!isAuthenticatedRequest(req)) {
    res.status(401);
    return next(new Error("Not Authorized"));
  }

  return next();
}

export default authorizationMiddleware;