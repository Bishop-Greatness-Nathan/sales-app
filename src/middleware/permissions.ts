import { UnAuthorizedError } from "../errors/customErrors"
import { AuthenticatedRequest } from "./authMiddleware"
import { NextFunction, Response } from "express"

export const permissions = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin" && !req.user?.approved)
    throw new UnAuthorizedError("Not authorized to perform this operation")
  next()
}
