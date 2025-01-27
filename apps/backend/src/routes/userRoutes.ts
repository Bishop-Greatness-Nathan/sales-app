import express from "express"
import {
  allUsers,
  currentUser,
  singleUser,
  updateUser,
  changePassword,
  approveUser,
} from "../controllers/userControllers"

const router = express.Router()

router.get("/", allUsers)

router.get("/current-user", currentUser)

router.post("/change-password", changePassword)

router.patch("/update-user/:id", updateUser)

router.patch("/approve-user/:id", approveUser)

router.get("/:id", singleUser)

export default router
