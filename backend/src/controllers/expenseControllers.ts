import { Response } from "express"
import { AuthenticatedRequest } from "../middleware/authMiddleware"
import {
  BadRequestError,
  NotFoundError,
  UnAuthorizedError,
} from "../errors/customErrors"
import Expense from "../models/expensesModel"
import User from "../models/userModel"
import Cash from "../models/cashModel"
import Bank from "../models/bankModel"
import { StatusCodes } from "http-status-codes"
import dayjs from "dayjs"

export const createExpense = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { description, amount, transactionType } = req.body
  if (!description || !amount || !transactionType)
    throw new BadRequestError("Please provide all values")

  const enteredAt = dayjs(new Date(Date.now())).format("YYYY-MM-DD")
  const userId = req.user?.userId

  const user = await User.findOne({ _id: req.user?.userId })
  if (!user) throw new NotFoundError("user not found")

  const enteredBy = user.firstName

  if (transactionType === "cash") {
    await Cash.create({
      amount,
      remark: description,
      action: "release",
      enteredBy: req.user?.userName,
      enteredAt,
    })
  }
  if (transactionType === "bank") {
    await Bank.create({
      amount,
      remark: description,
      action: "release",
      enteredBy: req.user?.userName,
      enteredAt,
    })
  }
  await Expense.create({ amount, description, enteredBy, enteredAt, userId })

  res.status(StatusCodes.CREATED).json({ msg: "Expense created" })
}

export const allExpenses = async (req: AuthenticatedRequest, res: Response) => {
  const { from, to } = req.query

  const queryObject: { enteredAt: { $gte: string; $lte: string } } = {
    enteredAt: { $gte: "", $lte: "" },
  }

  if (from && to) {
    queryObject.enteredAt = { $gte: from as string, $lte: to as string }
  }
  const expenses = await Expense.find(queryObject).sort({ createdAt: -1 })
  res.status(StatusCodes.OK).json({ count: expenses.length, expenses })
}

export const singleExpense = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const expense = await Expense.findById(req.params.id)
  if (!expense) throw new NotFoundError("Expense does not exist")

  const user = await User.findOne({ _id: expense.userId })
  if (!user) throw new NotFoundError("user not found")
  res.status(StatusCodes.OK).json({ enteredBy: user.firstName, expense })
}

export const updateExpense = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { description, amount } = req.body
  if (!description || !amount)
    throw new BadRequestError("Please provide all values")

  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Not permitted to perform this task")
  await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(StatusCodes.OK).json({ msg: "Expense record updated" })
}

export const deleteExpense = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (req.user?.role !== "admin")
    throw new UnAuthorizedError("Not permitted to perform this task")
  await Expense.findOneAndDelete({ _id: req.params.id })
  res.status(StatusCodes.OK).json({ msg: "Expense record deleted" })
}
