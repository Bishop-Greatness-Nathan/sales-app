import { Response } from "express"
import { AuthenticatedRequest } from "middleware/authMiddleware"
import Bank from "../models/bankModel"
import Cash from "../models/cashModel"
import { StatusCodes } from "http-status-codes"
import { BadRequestError } from "../errors/customErrors"
import dayjs from "dayjs"

export const createBankRecord = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { amount, remark, action } = req.body
  if (!amount || !remark || !action)
    throw new BadRequestError("please enter all values")

  const enteredAt = dayjs(new Date(Date.now())).format("YYYY-MM-DD")
  const enteredBy = req.user?.userName

  if (action === "to cash") {
    await Cash.create({
      amount,
      remark: "Cash withdrawn from bank",
      action: "add",
      enteredBy,
      enteredAt,
    })

    await Bank.create({
      amount,
      remark,
      action: "release",
      enteredBy,
      enteredAt,
    })
    res.status(StatusCodes.CREATED).json({ msg: "record created" })

    return
  }

  await Bank.create({
    amount,
    remark,
    action,
    enteredBy,
    enteredAt,
  })
  res.status(StatusCodes.CREATED).json({ msg: "record created" })
}

export const allBankRecords = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { from, to } = req.query

  const queryObject: { enteredAt: { $gte: string; $lte: string } } = {
    enteredAt: { $gte: "", $lte: "" },
  }

  if (from && to) {
    queryObject.enteredAt = { $gte: from as string, $lte: to as string }
  }
  const bank = await Bank.find(queryObject).sort({ createdAt: -1 })

  // calculate total balance
  const allBank = await Bank.find({})
  const totals = allBank.reduce(
    (total: { add: number; release: number }, bank) => {
      if (bank.action === "add") total.add += bank.amount || 0
      if (bank.action === "release") total.release += bank.amount || 0
      return total
    },
    { add: 0, release: 0 }
  )
  const bankBalance = totals.add - totals.release
  res.status(StatusCodes.OK).json({ bank, balance: bankBalance })
}

export const singleBankRecord = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  res.send("single bank record")
}
export const updateBankRecord = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  res.send("update bank record")
}
export const deleteBankRecord = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  res.send("delete bank record")
}
