import { StatusCodes } from "http-status-codes"

export class NotFoundError extends Error {
  public statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.NOT_FOUND
  }
}

export class BadRequestError extends Error {
  public statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}

export class UnAuthorizedError extends Error {
  public statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

export class UnauthenticatedError extends Error {
  public statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = StatusCodes.FORBIDDEN
  }
}
