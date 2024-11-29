import { Router } from "express"
import { createEndOfDay, getEndOfDay } from "../controllers/endOfDayControllers"

const router = Router()

router.get("/", getEndOfDay)

router.get("/new", createEndOfDay)

export default router
