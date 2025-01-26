import { Request, Response } from "express"
import { AuthenticatedRequest } from "../middleware/authMiddleware"
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
  UnauthenticatedError,
} from "../errors/customErrors"
import User from "../models/userModel"
import { StatusCodes } from "http-status-codes"
import { encode, confirmPassword } from "../utils/auth"

// GET ALL USERS
export const allUsers = async (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Not permitted to perform this task")

  const users = await User.find({}).select("-password")
  res.status(StatusCodes.OK).json({ users })
}

// GET CURRENT USER
export const currentUser = async (req: AuthenticatedRequest, res: Response) => {
  const user = await User.findOne({ _id: req.user?.userId }).select("-password")
  if (!user) throw new UnauthenticatedError("Invalid credentials")
  res.status(StatusCodes.OK).json({ user })
}

// GET SINGLE USER
export const singleUser = async (req: AuthenticatedRequest, res: Response) => {
  // if (req.user?.role !== "admin")
  //   throw new UnAuthorizedError("Not permitted to perform this task")

  if (!req.params.id) throw new BadRequestError("Params not provided")
  const user = await User.findById(req.params.id).select("-password")

  res.status(StatusCodes.OK).json({ user })
}

// UPDATE USER
export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { firstName, lastName, userName } = req.body
  if (!firstName || !lastName || !userName)
    throw new BadRequestError("Please provide all values")

  const user = await User.findOne({ _id: req.params.id })
  if (!user) throw new NotFoundError(`No user found with id: ${req.params.id}`)

  if (
    String(req.user?.userId) !== String(user._id) &&
    req.user?.role !== "admin"
  )
    throw new UnAuthorizedError("Not permitted to perform this task")

  const updatedUser = await User.findOneAndUpdate({ _id: user._id }, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(StatusCodes.OK).json({ updatedUser })
}

// CHANGE PASSWORD
export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { oldPassword, newPassword } = req.body

  if (!oldPassword || !newPassword)
    throw new BadRequestError("Please provide all values")

  if (oldPassword === newPassword)
    throw new BadRequestError("Passwords must be different")

  const user = await User.findOne({ _id: req.user?.userId })
  if (!user) throw new NotFoundError("User does not exist")

  const passwordCorrect = await confirmPassword(oldPassword, user.password)
  if (!passwordCorrect) throw new UnauthenticatedError("Authentication invalid")

  req.body.newPassword = await encode(newPassword)
  user.password = req.body.newPassword
  await user.save()

  res.status(StatusCodes.OK).json({ msg: "Password changed" })
}

// APPROVE USER
export const approveUser = async (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Unauthorized to perform this task")

  const user = await User.findById(req.params.id)
  if (!user) throw new NotFoundError("user not found")

  let approval
  if (user.approved === true) {
    approval = false
  } else {
    approval = true
  }

  await User.findByIdAndUpdate(
    req.params.id,
    { approved: approval },
    { runValidators: true, new: true }
  )
}
