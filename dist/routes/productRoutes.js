"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productControllers_1 = require("../controllers/productControllers");
const permissions_1 = require("../middleware/permissions");
const router = (0, express_1.Router)();
router.post("/", permissions_1.permissions, productControllers_1.createProduct);
router.get("/", productControllers_1.getProducts);
router.get("/:id", permissions_1.permissions, productControllers_1.getSingleProduct);
router.patch("/:id", permissions_1.permissions, productControllers_1.updateProduct);
router.delete("/:id", permissions_1.permissions, productControllers_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map