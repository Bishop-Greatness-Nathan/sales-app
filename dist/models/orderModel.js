"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SingleOrderItemSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    pcs: {
        type: Number,
        required: true,
    },
    subTotal: {
        type: Number,
        required: true,
    },
    returned: {
        type: Number,
        default: 0,
    },
    diff: {
        type: Number,
        required: true,
    },
    productId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "Product",
        required: true,
    },
});
const OrderSchema = new mongoose_1.default.Schema({
    total: {
        type: Number,
        required: true,
    },
    orderItems: [SingleOrderItemSchema],
    balance: Number,
    cash: Number,
    bank: Number,
    customer: {
        firstName: String,
        lastName: String,
        phoneNumber: String,
        role: String,
        _id: String,
    },
    points: Number,
    usedPoints: Number,
    userId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    enteredAt: { type: String, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Order", OrderSchema);
//# sourceMappingURL=orderModel.js.map