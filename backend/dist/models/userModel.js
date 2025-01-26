"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    branch: String,
    userName: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 20,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: "user",
    },
});
exports.default = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=userModel.js.map