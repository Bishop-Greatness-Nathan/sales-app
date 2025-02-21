import { Router } from "express"
import {
  createExpense,
  allExpenses,
  singleExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseControllers"
import { permissions } from "../middleware/permissions"

const router = Router()

router.post("/", permissions, createExpense)

router.get("/", allExpenses)

router.get("/:id", permissions, singleExpense)

router.patch("/:id", permissions, updateExpense)

router.delete("/:id", permissions, deleteExpense)

export default router
