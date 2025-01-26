"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ExpenseSchema = new mongoose_1.default.Schema({
    description: String,
    amount: Number,
    enteredAt: String,
    userId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    enteredBy: String,
}, { timestamps: true });
exports.default = mongoose_1.default.model("Expense", ExpenseSchema);
//# sourceMappingURL=expensesModel.js.map