"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bankControllers_1 = require("../controllers/bankControllers");
const permissions_1 = require("../middleware/permissions");
const router = (0, express_1.Router)();
router.post("/", permissions_1.permissions, bankControllers_1.createBankRecord);
router.get("/", bankControllers_1.allBankRecords);
router.get("/:id", permissions_1.permissions, bankControllers_1.singleBankRecord);
router.patch("/:id", permissions_1.permissions, bankControllers_1.updateBankRecord);
router.delete("/:id", permissions_1.permissions, bankControllers_1.deleteBankRecord);
exports.default = router;
//# sourceMappingURL=bankRoutes.js.map