"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const endOfDayControllers_1 = require("../controllers/endOfDayControllers");
const router = (0, express_1.Router)();
router.get("/", endOfDayControllers_1.getEndOfDay);
router.get("/new", endOfDayControllers_1.createEndOfDay);
exports.default = router;
//# sourceMappingURL=endOfDayRoutes.js.map