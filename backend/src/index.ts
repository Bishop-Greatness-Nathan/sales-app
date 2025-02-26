import express from "express"
import "express-async-errors"
import * as dotenv from "dotenv"
import mongoose from "mongoose"
dotenv.config()
import cookieParser from "cookie-parser"
import path from "path"
import morgan from "morgan"
import helmet from "helmet"
import ExpressMongoSanitize from "express-mongo-sanitize"

const app = express()

// middlewares
import notFoundError from "./middleware/notFound"
import errorHandler from "./middleware/errorHandler"
import { authenticateUser } from "./middleware/authMiddleware"

// routers
import authRouter from "./routes/authRoutes"
import userRouter from "./routes/userRoutes"
import productRouter from "./routes/productRoutes"
import orderRouter from "./routes/orderRoutes"
import expenseRouter from "./routes/expenseRoutes"
import storeRouter from "./routes/storeRoutes"
import customerRouter from "./routes/customerRoutes"
import cashRouter from "./routes/cashRoutes"
import bankRouter from "./routes/bankRoutes"
import categoryRouter from "./routes/categoryRoutes"
import endOfDayRouter from "./routes/endOfDayRoutes"

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}
app.use(express.static(path.resolve(__dirname, "./public")))

// app.use(express.static(path.resolve(__dirname, "../../front-end/dist")))

app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(ExpressMongoSanitize())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", authenticateUser, userRouter)
app.use("/api/v1/product", authenticateUser, productRouter)
app.use("/api/v1/order", authenticateUser, orderRouter)
app.use("/api/v1/expense", authenticateUser, expenseRouter)
app.use("/api/v1/store", authenticateUser, storeRouter)
app.use("/api/v1/customer", authenticateUser, customerRouter)
app.use("/api/v1/cash", authenticateUser, cashRouter)
app.use("/api/v1/bank", authenticateUser, bankRouter)
app.use("/api/v1/category", authenticateUser, categoryRouter)
app.use("/api/v1/endofday", authenticateUser, endOfDayRouter)

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"))
})
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../../front-end/dist", "index.html"))
// })

app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" })
})

// app.use(notFoundError)

app.use(errorHandler)

const port = Number(process.env.PORT) || 4000
const host = process.env.HOST || "0.0.0.0"

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string)

    app.listen(port, async () => {
      console.log("connected to DB")
      console.log(`server is listening on port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
