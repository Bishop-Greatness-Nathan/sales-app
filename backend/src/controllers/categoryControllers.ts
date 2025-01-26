import { Response } from "express"
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "../errors/customErrors"
import { AuthenticatedRequest } from "../middleware/authMiddleware"
import Category from "../models/categoryModel"
import { StatusCodes } from "http-status-codes"

// CREATE CATEGORY
export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name } = req.body
  if (!name) throw new BadRequestError("Please provide category name")
  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Not authorized to perform this operation")

  const alreadyExists = await Category.findOne({ name })
  if (alreadyExists) throw new BadRequestError("This category already exists")

  await Category.create(req.body)
  res.status(StatusCodes.CREATED).json({ msg: "category created" })
}

// GET ALL CATEGORIES
export const getAllCategories = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const categories = await Category.find({})
  res.status(StatusCodes.OK).json({ categories })
}

// EDIT CATEGORY
export const editCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name } = req.body
  if (!name) throw new BadRequestError("Please provide category name")
  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Not authorized to perform this operation")

  const category = await Category.findById(req.params.id)
  if (!category)
    throw new NotFoundError(`No category with id: ${req.params.id}`)

  await Category.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  })
  res.status(StatusCodes.OK).json({ msg: "category edited" })
}

// DELETE CATEGORY
export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Not authorized to perform this operation")

  const category = await Category.findById(req.params.id)
  if (!category)
    throw new NotFoundError(`No category with id: ${req.params.id}`)

  await Category.findByIdAndDelete(req.params.id)
  res.status(StatusCodes.OK).json({ msg: "category deleted" })
}
