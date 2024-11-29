import { Router } from "express"
import {
  createOrder,
  getAllOrders,
  deleteOrder,
  singleOrder,
  getProfit,
  updateOrder,
  returnItem,
} from "../controllers/orderControllers"
import { permissions } from "../middleware/permissions"

const router = Router()

router.post("/", permissions, createOrder)

router.get("/", getAllOrders)

router.get("/profit", permissions, getProfit)

router.patch("/return-item", permissions, returnItem)

router.patch("/:id", permissions, updateOrder)

router.delete("/:id", permissions, deleteOrder)

router.get("/:id", permissions, singleOrder)

export default router
