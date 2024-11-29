import jwt from "jsonwebtoken"
import mongoose from "mongoose"

type Payload = {
  _id: mongoose.Types.ObjectId
  userName: string
  role: string
  approved: boolean
}

export const createJwt = (payload: Payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_LIFETIME,
  })
}

export const verifyJwt = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string)
}
