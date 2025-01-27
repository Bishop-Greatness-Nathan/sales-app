import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
const notFoundError = (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).send("page not found")
}

export default notFoundError
