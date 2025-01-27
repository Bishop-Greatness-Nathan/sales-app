import { Router } from "express"
import {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productControllers"
import { permissions } from "../middleware/permissions"

const router = Router()

router.post("/", permissions, createProduct)

router.get("/", getProducts)

router.get("/:id", permissions, getSingleProduct)

router.patch("/:id", permissions, updateProduct)

router.delete("/:id", permissions, deleteProduct)

export default router
