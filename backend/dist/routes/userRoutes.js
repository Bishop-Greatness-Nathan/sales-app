"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
const router = express_1.default.Router();
router.get("/", userControllers_1.allUsers);
router.get("/current-user", userControllers_1.currentUser);
router.post("/change-password", userControllers_1.changePassword);
router.patch("/update-user/:id", userControllers_1.updateUser);
router.patch("/approve-user/:id", userControllers_1.approveUser);
router.get("/:id", userControllers_1.singleUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map