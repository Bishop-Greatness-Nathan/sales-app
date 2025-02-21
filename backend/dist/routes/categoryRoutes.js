"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryControllers_1 = require("../controllers/categoryControllers");
const permissions_1 = require("../middleware/permissions");
const router = (0, express_1.Router)();
router.post("/", permissions_1.permissions, categoryControllers_1.createCategory);
router.get("/", categoryControllers_1.getAllCategories);
router.patch("/:id", permissions_1.permissions, categoryControllers_1.editCategory);
router.delete("/:id", permissions_1.permissions, categoryControllers_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map