"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CashSchema = new mongoose_1.default.Schema({
    amount: Number,
    remark: {
        type: String,
        default: "Cash from sales order",
    },
    action: {
        type: String,
        default: "add",
    },
    enteredBy: String,
    enteredAt: String,
}, { timestamps: true });
exports.default = mongoose_1.default.model("Cash", CashSchema);
//# sourceMappingURL=cashModel.js.map