import type { Request } from "express";

export type Role = "trainer" | "admin";
export type AuthenticatedRequest = Request & { username: string; role: Role };

export const isAuthenticatedRequest = (
  req: Request,
): req is AuthenticatedRequest => {
  return (
    typeof (req as AuthenticatedRequest).username === "string" &&
    ["trainer", "admin"].includes((req as AuthenticatedRequest).role)
  );
};
