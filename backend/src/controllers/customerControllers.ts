import { BadRequestError, NotFoundError } from "../errors/customErrors"
import { Response } from "express"
import { AuthenticatedRequest } from "../middleware/authMiddleware"
import { StatusCodes } from "http-status-codes"
import Customer from "../models/customerModel"

export const createCustomer = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { firstName, lastName, phoneNumber } = req.body
  if (!firstName || !lastName || !phoneNumber)
    throw new BadRequestError("Please enter all fields")

  const alreadyExists = await Customer.findOne({ phoneNumber })
  if (alreadyExists) throw new BadRequestError("This customer already exists")

  await Customer.create(req.body)
  res.status(StatusCodes.CREATED).json({ msg: "customer account created" })
}

export const filterCustomers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { customerId, debtors } = req.query

  if (customerId === "all" && debtors === "false") {
    const customers = await Customer.find({}).sort({ firstName: 1 })
    res.status(StatusCodes.OK).json({ count: customers.length, customers })
    return
  } else if (customerId === "all" && debtors === "true") {
    const customers = await Customer.find({ debt: { $gt: 0 } }).sort({
      firstName: 1,
    })
    res.status(StatusCodes.OK).json({ count: customers.length, customers })
    return
  } else {
    const customers = await Customer.find({ _id: customerId })
    res.status(StatusCodes.OK).json({ count: customers.length, customers })
    return
  }
}

export const getAllCustomers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const customers = await Customer.find({}).sort({ firstName: 1 })
  res.status(StatusCodes.OK).json({ count: customers.length, customers })
}

export const getSingleCustomer = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const customer = await Customer.findOne({ _id: req.params.id })
  if (!customer)
    throw new NotFoundError(`No customer found with the id: ${req.params.id}`)
  res.status(StatusCodes.OK).json({ customer })
}

export const updateCustomer = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { firstName, lastName, phoneNumber } = req.body
  if (!firstName || !lastName || !phoneNumber)
    throw new BadRequestError("Please provide all values")

  const customer = await Customer.findOne({ _id: req.params.id })
  if (!customer)
    throw new NotFoundError(`No customer found with the id: ${req.params.id}`)

  const editedCustomer = await Customer.findOneAndUpdate(
    { _id: req.params.id },
    { ...req.body },
    { runValidators: true, new: true }
  )
  res.status(StatusCodes.OK).json({ editedCustomer })
}

export const deleteCustomer = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const customer = await Customer.findOne({ _id: req.params.id })
  if (!customer)
    throw new NotFoundError(`No customer found with the id: ${req.params.id}`)
  await Customer.findOneAndDelete({ _id: req.params.id })
  res.status(StatusCodes.OK).json({ msg: "customer deleted" })
}

export const resetPointsUsage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  //  const exp = new Date(Date.now())
  //  console.log(exp.getDate())
  await Customer.updateMany({ pointsUsage: { $gt: 0 } }, { pointsUsage: 0 })

  res.status(StatusCodes.OK).json({ msg: "points usage reset successful" })
}
