import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/customErrors"
import { AuthenticatedRequest } from "../middleware/authMiddleware"

import { Request, Response } from "express"
import User from "../models/userModel"
import { encode, confirmPassword } from "../utils/auth"
import { StatusCodes } from "http-status-codes"
import { createJwt } from "../utils/tokenUtils"

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, branch, userName, password } = req.body
  if (!firstName || !lastName || !branch || !userName || !password) {
    throw new BadRequestError("please provide all values")
  }

  const existingUser = await User.findOne({ userName })
  if (existingUser) {
    throw new BadRequestError("user already exist")
  }

  const isFirstUser = (await User.countDocuments({})) === 0
  if (isFirstUser) {
    req.body.role = "admin"
    req.body.approved = "true"
  }

  req.body.password = await encode(password)

  await User.create(req.body)

  res.status(StatusCodes.CREATED).json({ msg: "user created" })
}

export const login = async (req: Request, res: Response) => {
  const { userName, password } = req.body

  const userExists = await User.findOne({ userName })
  if (!userExists) throw new NotFoundError("user does not exist")

  const passwordCorrect = await confirmPassword(password, userExists.password)
  if (!passwordCorrect) throw new UnauthenticatedError("Authentication invalid")

  const payload = {
    _id: userExists._id,
    userName: userExists.userName,
    role: userExists.role,
    approved: userExists.approved,
  }
  const token = createJwt(payload)
  const oneDay = 1000 * 60 * 60 * 24

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + oneDay),
  })

  res.status(StatusCodes.OK).json({ msg: "user logged in" })
}

export const logout = (req: Request, res: Response) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  })

  res.status(StatusCodes.OK).json({ msg: "Logged out..." })
}

// FORGOT PASSWORD
export const forgotPassword = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { userName, password, confirmPassword } = req.body
  if (!userName || !password || !confirmPassword)
    throw new BadRequestError("Please provide all values")

  if (password !== confirmPassword)
    throw new BadRequestError("Passwords must match")

  const user = await User.findOne({ userName })
  if (!user) throw new NotFoundError("User does not exist. Create account.")

  const newPassword = await encode(password)
  user.password = newPassword
  await user.save()
  res.status(StatusCodes.OK).json({ msg: "Password changed. Login to account" })
}
