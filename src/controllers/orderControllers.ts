import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
  UnauthenticatedError,
} from "../errors/customErrors"
import { AuthenticatedRequest } from "../middleware/authMiddleware"
import { Response } from "express"
import Order from "../models/orderModel"
import Product from "../models/productModel"
import Customer from "../models/customerModel"
import User from "../models/userModel"
import Expense from "../models/expensesModel"
import { StatusCodes } from "http-status-codes"
import dayjs from "dayjs"
import Cash from "../models/cashModel"
import Bank from "../models/bankModel"
import { calculateProfit } from "../utils/methods"
import { ExpenseType, OrderType } from "../utils/types"

// CREATE ORDER
export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  const { total, items, balance, cash, bank, usedPoints, customer } = req.body
  if (!total || !items) throw new NotFoundError("Missing fields")

  req.body.enteredAt = dayjs(new Date(Date.now())).format("YYYY-MM-DD")
  const orderItems = items

  let points: number = 0

  // add customer debt
  if (balance > 0 && customer.phoneNumber !== "") {
    const existingCustomer = await Customer.findOne({
      _id: customer._id,
    })
    if (!existingCustomer) throw new NotFoundError("customer not found")
    existingCustomer.debt += Number(balance)
    await existingCustomer.save()
  }

  // loyalty points
  if (balance === 0 && customer.phoneNumber !== "" && usedPoints === 0) {
    const existingCustomer = await Customer.findOne({ _id: customer._id })
    if (!existingCustomer) throw new NotFoundError("customer not found")
    points = total * 0.005
    existingCustomer.points = Number(existingCustomer.points) + points

    await existingCustomer.save()
  }

  // points usage
  if (
    usedPoints > 0 &&
    balance === 0 &&
    cash === 0 &&
    bank === 0 &&
    customer.phoneNumber !== ""
  ) {
    const existingCustomer = await Customer.findOne({ _id: customer._id })
    if (!existingCustomer) throw new NotFoundError("customer not found")

    if (existingCustomer.debt > 0) {
      throw new BadRequestError("this customer is a debtor")
    }

    if (existingCustomer.pointsUsage < 2) {
      existingCustomer.points -= Number(usedPoints)
      existingCustomer.pointsUsage += 1
    } else {
      throw new BadRequestError(
        "this customer has exceeded points usage for the month"
      )
    }

    await existingCustomer.save()
  }

  // check for correct product
  for (let orderItem of orderItems) {
    let existingItem = await Product.findOne({ _id: orderItem.productId })
    if (!existingItem)
      throw new NotFoundError(`No product with id: ${orderItem.productId}`)

    // update inventory
    existingItem.qty -= orderItem.pcs
    await Product.findOneAndUpdate(
      { _id: orderItem.productId },
      { qty: existingItem.qty },
      { new: true, runValidators: true }
    )
  }

  await Order.create({
    total,
    orderItems,
    balance,
    cash,
    bank,
    usedPoints,
    userId: req.user?.userId,
    customer,
    points,
    enteredAt: req.body.enteredAt,
  })

  if (cash > 0) {
    await Cash.create({
      amount: cash,
      enteredBy: req.user?.userName,
      enteredAt: req.body.enteredAt,
    })
  }
  if (bank > 0) {
    await Bank.create({
      amount: bank,
      enteredBy: req.user?.userName,
      enteredAt: req.body.enteredAt,
    })
  }

  res.status(StatusCodes.CREATED).json({ msg: "Order Created" })
}

// GET ALL ORDERS
export const getAllOrders = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { from, to, userId } = req.query

  let queryObject: {
    enteredAt: { $gte: string; $lte: string }
    userId?: string
  } = {
    enteredAt: { $gte: "", $lte: "" },
  }

  if (from && to && userId === "all") {
    queryObject = { enteredAt: { $gte: from as string, $lte: to as string } }
  } else {
    queryObject = {
      enteredAt: { $gte: from as string, $lte: to as string },
      userId: userId as string,
    }
  }

  const orders: OrderType[] = await Order.find(queryObject)
    .sort({ createdAt: -1 })
    .lean()
  const expenses: ExpenseType[] = await Expense.find(queryObject)
    .sort({ createdAt: -1 })
    .lean()

  const analysis = calculateProfit(orders, expenses)
  res.status(StatusCodes.OK).json({ count: orders.length, orders, analysis })
}

// GET SINGLE ORDER
export const singleOrder = async (req: AuthenticatedRequest, res: Response) => {
  const order = await Order.findOne({ _id: req.params.id })
  if (!order) throw new NotFoundError("This order does not exist")

  const user = await User.findOne({ _id: order.userId })
  if (!user) throw new NotFoundError("No user found")

  res.status(StatusCodes.OK).json({ soldBy: user.firstName, order })
}

// DELETE ORDER .... THIS WILL NOT BE CARRIED OUT THOUGH
export const deleteOrder = async (req: AuthenticatedRequest, res: Response) => {
  if (req.user?.role !== "admin") throw new UnAuthorizedError("Not Permitted")

  const order = await Order.findOne({ _id: req.params.id })
  if (!order)
    throw new NotFoundError(`No order found with id: ${req.params.id}`)

  for (let item of order.orderItems) {
    const product = await Product.findOne({ _id: item.productId })

    if (!product) throw new NotFoundError("Product does not exist")
    product.qty += item.pcs

    await Product.findOneAndUpdate(
      { _id: item.productId },
      { qty: product.qty },
      { new: true, runValidators: true }
    )
  }

  await Order.findOneAndDelete({ _id: req.params.id })
  res.status(StatusCodes.OK).json({ msg: "Order deleted" })
}

// UPDATE ORDER
export const updateOrder = async (req: AuthenticatedRequest, res: Response) => {
  const { amountPaid, paymentType } = req.body

  const enteredAt = dayjs(new Date(Date.now())).format("YYYY-MM-DD")

  const order = await Order.findById(req.params.id)
  if (!order) throw new NotFoundError("order not found")

  await Order.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { runValidators: true, new: true }
  )

  if (amountPaid && amountPaid > 0) {
    const customer = await Customer.findOne({ _id: order.customer?._id })
    if (!customer) throw new NotFoundError("Customer not found")
    customer.debt = Number(customer.debt) - Number(amountPaid)
    await customer.save()
  }

  if (paymentType === "cash" && amountPaid > 0) {
    await Cash.create({
      amount: amountPaid,
      enteredBy: req.user?.userName,
      enteredAt: enteredAt,
      remark: `Cash received from debt paid by ${order.customer?.firstName} ${order.customer?.lastName}`,
    })
  }

  if (paymentType === "bank" && amountPaid > 0) {
    await Bank.create({
      amount: amountPaid,
      enteredBy: req.user?.userName,
      enteredAt: enteredAt,
      remark: `Money received from debt paid by ${order.customer?.firstName} ${order.customer?.lastName}`,
    })
  }

  res.status(StatusCodes.OK).json({ msg: "order updated" })
}

// CALCULATE PROFIT
export const getProfit = async (req: AuthenticatedRequest, res: Response) => {
  let grossProfit: number = 0

  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Not permitted to perform this task")

  const orders = await Order.find({})

  for (let order of orders) {
    for (let item of order.orderItems) {
      if (!item.returned) {
        grossProfit += item.diff
      }
    }
  }

  const expenses = await Expense.find({})
  const totalExpenses = expenses.reduce((total, value) => {
    total += value.amount as number
    return total
  }, 0)

  const analysis: {
    grossProfit: number
    totalExpenses: number
    netProfit: number
  } = {
    grossProfit,
    totalExpenses,
    netProfit: grossProfit - totalExpenses,
  }
  res.status(StatusCodes.OK).json({ analysis })
}

// RETURN ITEM
export const returnItem = async (req: AuthenticatedRequest, res: Response) => {
  const enteredAt = dayjs(new Date(Date.now())).format("YYYY-MM-DD")
  const enteredBy = req.user?.userName
  if (req.user?.role !== "admin") throw new UnAuthorizedError("Not permitted")

  const { newDiff, subTotal, returned, returnType, productId, price, pcs } =
    req.body

  console.log(price)
  const { orderId, itemId } = req.query
  if (!orderId || !itemId) throw new UnauthenticatedError("Invalid credentials")

  const order = await Order.findOne({ _id: orderId })
  if (!order) throw new NotFoundError("Order does not exist")

  // update product
  const product = await Product.findOne({ _id: productId })
  if (!product) throw new NotFoundError("This product does not exist")
  product.qty = product.qty + returned
  await product.save()

  // edit order items
  const quantity = pcs - returned
  const newOrderItems = order.orderItems.map((item) => {
    if (String(item._id) === itemId) {
      item.returned += Number(returned)
      item.pcs = Number(quantity)
      item.subTotal = Number(subTotal)
      item.diff = Number(newDiff)
    }
    return item
  })

  // check cash
  const cashValue =
    returnType === "cash"
      ? Number(order.cash) - Number(price * returned)
      : Number(order.cash)

  // check bank
  const bankValue =
    returnType === "bank"
      ? Number(order.bank) - Number(price * returned)
      : Number(order.bank)

  // calculate new order total
  const newTotal = Number(order.total) - Number(price * returned)

  // calculate points
  const newPoints = Number(newTotal * 0.005)

  // update order
  const updatedOrder = await Order.findOneAndUpdate(
    { _id: orderId },
    {
      orderItems: newOrderItems,
      total: newTotal,
      cash: cashValue,
      bank: bankValue,
      points: newPoints,
    },
    { new: true, runValidators: true }
  )

  // update customer points
  const customer = await Customer.findOne({ _id: order.customer?._id })
  if (customer) {
    const returnedItemPrice = Number(price * returned)
    customer.points -= returnedItemPrice * 0.005

    await customer.save()
  }

  // create new cash record
  if (returnType === "cash") {
    await Cash.create({
      amount: Number(price * returned),
      remark: "Cash given for returned goods",
      action: "release",
      enteredAt,
      enteredBy,
    })
  }

  // create new bank record
  if (returnType === "bank") {
    await Bank.create({
      amount: Number(price * returned),
      remark: "Money transfered for returned goods",
      action: "release",
      enteredAt,
      enteredBy,
    })
  }

  res.status(StatusCodes.OK).json({ updatedOrder })
}
