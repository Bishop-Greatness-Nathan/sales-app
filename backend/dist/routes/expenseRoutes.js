"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expenseControllers_1 = require("../controllers/expenseControllers");
const permissions_1 = require("../middleware/permissions");
const router = (0, express_1.Router)();
router.post("/", permissions_1.permissions, expenseControllers_1.createExpense);
router.get("/", expenseControllers_1.allExpenses);
router.get("/:id", permissions_1.permissions, expenseControllers_1.singleExpense);
router.patch("/:id", permissions_1.permissions, expenseControllers_1.updateExpense);
router.delete("/:id", permissions_1.permissions, expenseControllers_1.deleteExpense);
exports.default = router;
//# sourceMappingURL=expenseRoutes.js.map