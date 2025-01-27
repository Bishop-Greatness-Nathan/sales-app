"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../controllers/authControllers");
const router = express_1.default.Router();
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1000 * 60 * 15,
    max: 15,
    message: { msg: "IP rate limit exceeded, retry in 15mins" },
});
router.post("/register", apiLimiter, authControllers_1.register);
router.post("/forgot-password", authControllers_1.forgotPassword);
router.post("/login", apiLimiter, authControllers_1.login);
router.get("/logout", authControllers_1.logout);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map