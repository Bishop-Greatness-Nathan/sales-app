import { Response } from "express"
import { AuthenticatedRequest } from "middleware/authMiddleware"
import Products from "../models/productModel"
import EndOfDay from "../models/endOfDayModel"
import dayjs from "dayjs"
import { StatusCodes } from "http-status-codes"
import { getWorth } from "../utils/methods"

export const createEndOfDay = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const today = dayjs(new Date(Date.now())).format("YYYY-MM-DD")
  const products = await Products.find({})
  const stockExists = await EndOfDay.findOne({ date: today })
  if (stockExists) {
    await EndOfDay.findOneAndReplace(
      { date: today },
      { date: today, products },
      { returnOriginal: false }
    )
    return
  }

  await EndOfDay.create({ date: today, products })

  res.status(StatusCodes.CREATED).json({ msg: "end of day created" })
}

export const getEndOfDay = async (req: AuthenticatedRequest, res: Response) => {
  const today = new Date(Date.now()).getTime()
  const _40days = 40 * 24 * 60 * 60 * 1000
  const newDate = today - _40days
  const calculated = dayjs(new Date(newDate)).format("YYYY-MM-DD")
  await EndOfDay.deleteMany({ date: { $lt: calculated } })

  const { date, product: name, category } = req.query

  let stock = await EndOfDay.findOne({ date })
  stock?.products.sort((a, b) => a.name.localeCompare(b.name))

  if (!stock) {
    res.status(StatusCodes.OK).json({ products: null })
  } else {
    if (category === "All Products" && name === "All Products") {
      const products = stock.products
      const worth = getWorth(products)
      res.status(StatusCodes.OK).json({ products, worth })
      return
    } else if (category === "All Products" && name !== "All Products") {
      const products = stock.products.filter((product) => product.name === name)
      const worth = getWorth(products)
      res.status(StatusCodes.OK).json({ products, worth })
      return
    } else if (category !== "All Products" && name === "All Products") {
      const products = stock.products.filter(
        (product) => product.category === category
      )
      const worth = getWorth(products)
      res.status(StatusCodes.OK).json({ products, worth })
      return
    } else {
      const products = stock.products.filter(
        (product) => product.category === category && product.name === name
      )
      const worth = getWorth(products)
      res.status(StatusCodes.OK).json({ products, worth })
      return
    }
  }
}
