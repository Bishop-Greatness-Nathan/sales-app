"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    store: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    CP: {
        type: Number,
        required: true,
    },
    SP: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    maximumQty: Number,
    minimumQty: Number,
    category: String,
    userId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User",
        required: true,
    },
});
exports.default = mongoose_1.default.model("Product", ProductSchema);
//# sourceMappingURL=productModel.js.map