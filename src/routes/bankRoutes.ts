import { Router } from "express"
import {
  createBankRecord,
  allBankRecords,
  singleBankRecord,
  updateBankRecord,
  deleteBankRecord,
} from "../controllers/bankControllers"
import { permissions } from "../middleware/permissions"

const router = Router()

router.post("/", permissions, createBankRecord)

router.get("/", allBankRecords)

router.get("/:id", permissions, singleBankRecord)

router.patch("/:id", permissions, updateBankRecord)

router.delete("/:id", permissions, deleteBankRecord)

export default router
