import { Router } from "express"
import {
  createCategory,
  getAllCategories,
  editCategory,
  deleteCategory,
} from "../controllers/categoryControllers"
import { permissions } from "../middleware/permissions"

const router = Router()

router.post("/", permissions, createCategory)

router.get("/", getAllCategories)

router.patch("/:id", permissions, editCategory)

router.delete("/:id", permissions, deleteCategory)

export default router
