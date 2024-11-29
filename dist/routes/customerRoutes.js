"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerControllers_1 = require("../controllers/customerControllers");
const permissions_1 = require("../middleware/permissions");
const router = (0, express_1.Router)();
router.post("/", permissions_1.permissions, customerControllers_1.createCustomer);
router.get("/", customerControllers_1.getAllCustomers);
router.get("/filter", customerControllers_1.filterCustomers);
router.get("/:id", permissions_1.permissions, customerControllers_1.getSingleCustomer);
router.patch("/:id", permissions_1.permissions, customerControllers_1.updateCustomer);
router.delete("/:id", permissions_1.permissions, customerControllers_1.deleteCustomer);
exports.default = router;
//# sourceMappingURL=customerRoutes.js.map