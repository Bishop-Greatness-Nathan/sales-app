import { AuthenticatedRequest } from "../middleware/authMiddleware"
import { Response } from "express"
import Product from "../models/productModel"
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "../errors/customErrors"
import { StatusCodes } from "http-status-codes"
import { getStoreWorth } from "../utils/methods"
import { ProductTypes } from "utils/types"

// CREATE STORE PRODUCT
export const createStoreProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, store } = req.body

  if (!name || !store) throw new BadRequestError("Please provide all values")

  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Not permitted to perform this task")
  const product = await Product.findOne({ name })
  if (!product) throw new NotFoundError("product does not exist")
  if (product.store > 0)
    throw new BadRequestError("This product is already in store")

  await Product.findOneAndUpdate(
    { name },
    { store },
    { new: true, runValidators: true }
  )
  res.status(StatusCodes.OK).json({ msg: "Product added to store" })
}

// UPDATE STORE PRODUCT
export const updateStore = async (req: AuthenticatedRequest, res: Response) => {
  const { name, CP, SP, store, release } = req.body

  if (!name || !CP || !SP || !store)
    throw new BadRequestError("Please provide all values")
  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Not permitted to perform this task")

  const product = await Product.findOne({ name })

  if (!product) throw new NotFoundError("Product not found")

  product.qty = Number(release) + Number(product.qty)
  await Product.findOneAndUpdate(
    { name },
    { ...req.body, qty: product.qty },
    {
      new: true,
      runValidators: true,
    }
  )

  res.status(StatusCodes.OK).json({ msg: "store product updated" })
}

// CALCULATE WORTH OF GOODS IN STORE
export const calcStoreWorth = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { product, category } = req.query

  if (category === "All Products" && product === "All Products") {
    const products: ProductTypes[] = await Product.find({ store: { $gte: 1 } })
      .sort({
        name: 1,
      })
      .lean<ProductTypes[]>()
    const storeWorth = getStoreWorth(products)
    res.status(StatusCodes.OK).json({ products, storeWorth })
    return
  } else if (category === "All Products" && product !== "All Products") {
    const products: ProductTypes[] = await Product.find({
      store: { $gte: 1 },
      name: product,
    })
      .sort({
        name: 1,
      })
      .lean<ProductTypes[]>()
    const storeWorth = getStoreWorth(products)
    res.status(StatusCodes.OK).json({ products, storeWorth })
    return
  } else if (category !== "All Products" && product === "All Products") {
    const products: ProductTypes[] = await Product.find({
      store: { $gte: 1 },
      category,
    })
      .sort({
        name: 1,
      })
      .lean<ProductTypes[]>()
    const storeWorth = getStoreWorth(products)
    res.status(StatusCodes.OK).json({ products, storeWorth })
    return
  } else {
    const products: ProductTypes[] = await Product.find({
      store: { $gte: 1 },
      category,
      name: product,
    }).lean<ProductTypes[]>()
    const storeWorth = getStoreWorth(products)
    res.status(StatusCodes.OK).json({ products, storeWorth })
    return
  }
}
