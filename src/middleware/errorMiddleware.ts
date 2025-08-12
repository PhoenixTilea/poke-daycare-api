import type {Request, Response, NextFunction} from "express";

const errorMiddleware = (error: Error, req: Request, res: Response, _next: NextFunction) => {
  const isAxiosError = "name" in error
    ? error.name === "AxiosError"
    : false;

  if (!isAxiosError && "status" in error && typeof error.status === "number") {
    res.status(error.status);
    return res.send(error.message);
  }

  if (res.statusCode === 200) {
    console.error(error);
    res.status(500);
    return res.send("Sorry, something is broken on our end! Woopsy-doodle!");
  }

  return res.send(error.message);
}

export default errorMiddleware;