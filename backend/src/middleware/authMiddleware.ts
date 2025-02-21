import { UnauthenticatedError } from "../errors/customErrors"
import { Request, Response, NextFunction } from "express"
import { verifyJwt } from "../utils/tokenUtils"
import mongoose from "mongoose"

// Extent the Request interface to include the user property

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    userName: string
    role: string
    approved: boolean
  }
}

export const authenticateUser = (
  req: AuthenticatedRequest, // use the extended interface
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies
  if (!token) throw new UnauthenticatedError("Invalid credentials")

  const payload = verifyJwt(token)

  if (typeof payload === "string")
    throw new UnauthenticatedError("invalid token payload")

  req.user = {
    userId: payload._id,
    userName: payload.userName,
    role: payload.role,
    approved: payload.approved,
  }
  next()
}
