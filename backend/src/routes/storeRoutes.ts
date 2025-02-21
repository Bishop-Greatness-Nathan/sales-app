import { Router } from "express"
import {
  calcStoreWorth,
  createStoreProduct,
  updateStore,
} from "../controllers/storeControllers"
import { permissions } from "../middleware/permissions"

const router = Router()

router.post("/", permissions, createStoreProduct)

router.get("/", calcStoreWorth)

router.patch("/:id", permissions, updateStore)

export default router
