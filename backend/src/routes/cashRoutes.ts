import { Router } from "express"
import {
  createCashRecord,
  allCashRecords,
  singleCashRecord,
  updateCashRecord,
  deleteCashRecord,
} from "../controllers/cashControllers"
import { permissions } from "../middleware/permissions"

const router = Router()

router.post("/", permissions, createCashRecord)

router.get("/", allCashRecords)

router.get("/:id", permissions, singleCashRecord)

router.patch("/:id", permissions, updateCashRecord)

router.delete("/:id", permissions, deleteCashRecord)

export default router
