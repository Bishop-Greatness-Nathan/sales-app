import { Response } from "express"
import { AuthenticatedRequest } from "../middleware/authMiddleware"
import Product from "../models/productModel"
import User from "../models/userModel"
import { StatusCodes } from "http-status-codes"
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "../errors/customErrors"
import { getWorth } from "../utils/methods"
import { ProductTypes } from "../utils/types"

// CREATE NEW PRODUCT
export const createProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, qty, CP, SP, store, category } = req.body
  if (!name || !qty || !CP || !SP || !store || !category)
    throw new BadRequestError("Please provide all values")

  req.body.userId = req.user?.userId

  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Unauthorized to perform this task")

  const user = await User.findOne({ _id: req.user?.userId })

  if (!user) throw new NotFoundError("User not found")

  req.body.branch = user.branch

  const existingProduct = await Product.findOne({ name })
  if (existingProduct) throw new BadRequestError("Product already exists")

  await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ msg: "Product created" })
}

// GET ALL PRODUCTS
export const getProducts = async (req: AuthenticatedRequest, res: Response) => {
  const { product, category } = req.query

  if (category === "All Products" && product === "All Products") {
    const products: ProductTypes[] = await Product.find({})
      .sort({ name: 1 })
      .lean()
    const worth = getWorth(products)
    res.status(StatusCodes.OK).json({ products, worth })
    return
  } else if (category === "All Products" && product !== "All Products") {
    const products: ProductTypes[] = await Product.find({ name: product })
      .sort({
        name: 1,
      })
      .lean()
    const worth = getWorth(products)
    res.status(StatusCodes.OK).json({ products, worth })
    return
  } else if (category !== "All Products" && product === "All Products") {
    const products: ProductTypes[] = await Product.find({ category })
      .sort({
        name: 1,
      })
      .lean()
    const worth = getWorth(products)
    res.status(StatusCodes.OK).json({ products, worth })
    return
  } else {
    const products: ProductTypes[] = await Product.find({
      category,
      name: product,
    }).lean()
    const worth = getWorth(products)
    res.status(StatusCodes.OK).json({ products, worth })
    return
  }
}

// GET SINGLE PRODUCT
export const getSingleProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const product = await Product.findOne({ _id: req.params.id })
  if (!product) throw new NotFoundError("Product not found")

  res.status(StatusCodes.OK).json({ product })
}

// UPDATE PRODUCT
export const updateProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, CP, SP, qty, category } = req.body
  if (!name || !CP || !SP || !qty || !category)
    throw new BadRequestError("Please provide all values")

  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Unauthorized to perform this task")

  const product = await Product.findById(req.params.id)
  if (!product) throw new NotFoundError("Product not found")

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  )
  res.status(StatusCodes.OK).json({ updatedProduct })
}

// DELETE PRODUCT
export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Unauthorized to perform this task")

  await Product.findByIdAndDelete(req.params.id)
  res.status(StatusCodes.OK).json({ msg: "Product deleted" })
}
