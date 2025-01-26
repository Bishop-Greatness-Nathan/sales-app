"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cashControllers_1 = require("../controllers/cashControllers");
const permissions_1 = require("../middleware/permissions");
const router = (0, express_1.Router)();
router.post("/", permissions_1.permissions, cashControllers_1.createCashRecord);
router.get("/", cashControllers_1.allCashRecords);
router.get("/:id", permissions_1.permissions, cashControllers_1.singleCashRecord);
router.patch("/:id", permissions_1.permissions, cashControllers_1.updateCashRecord);
router.delete("/:id", permissions_1.permissions, cashControllers_1.deleteCashRecord);
exports.default = router;
//# sourceMappingURL=cashRoutes.js.map