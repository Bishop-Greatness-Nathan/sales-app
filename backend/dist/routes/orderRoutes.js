"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderControllers_1 = require("../controllers/orderControllers");
const permissions_1 = require("../middleware/permissions");
const router = (0, express_1.Router)();
router.post("/", permissions_1.permissions, orderControllers_1.createOrder);
router.get("/", orderControllers_1.getAllOrders);
router.get("/profit", permissions_1.permissions, orderControllers_1.getProfit);
router.patch("/return-item", permissions_1.permissions, orderControllers_1.returnItem);
router.patch("/:id", permissions_1.permissions, orderControllers_1.updateOrder);
router.delete("/:id", permissions_1.permissions, orderControllers_1.deleteOrder);
router.get("/:id", permissions_1.permissions, orderControllers_1.singleOrder);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map