"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CustomerSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: String,
        minLength: 11,
        maxLength: 11,
        trim: true,
    },
    debt: { type: Number, default: 0 },
    role: {
        type: String,
        default: "customer",
    },
    bonus: Number,
});
exports.default = mongoose_1.default.model("Customer", CustomerSchema);
//# sourceMappingURL=customerModel.js.map