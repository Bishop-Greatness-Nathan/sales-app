import express from "express"
import {
  register,
  login,
  logout,
  forgotPassword,
} from "../controllers/authControllers"

const router = express.Router()

import rateLimiter from "express-rate-limit"
const apiLimiter = rateLimiter({
  windowMs: 1000 * 60 * 15,
  max: 15,
  message: { msg: "IP rate limit exceeded, retry in 15mins" },
})

router.post("/register", apiLimiter, register)

router.post("/forgot-password", forgotPassword)

router.post("/login", apiLimiter, login)

router.get("/logout", logout)

export default router
