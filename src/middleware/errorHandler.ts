import { Request, Response, NextFunction } from "express"
import { StatusCodes } from "http-status-codes"

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = {
    // set default
    statusCode: (err as any)?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  }
  if ((err as any).code && (err as any).code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      (err as any).keyValue
    )} field, please choose another value`
    customError.statusCode = 400
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

export default errorHandler
