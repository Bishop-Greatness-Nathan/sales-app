"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.logout = exports.login = exports.register = void 0;
const customErrors_1 = require("../errors/customErrors");
const userModel_1 = __importDefault(require("../models/userModel"));
const auth_1 = require("../utils/auth");
const http_status_codes_1 = require("http-status-codes");
const tokenUtils_1 = require("../utils/tokenUtils");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, branch, userName, password } = req.body;
    if (!firstName || !lastName || !branch || !userName || !password) {
        throw new customErrors_1.BadRequestError("please provide all values");
    }
    const existingUser = yield userModel_1.default.findOne({ userName });
    if (existingUser) {
        throw new customErrors_1.BadRequestError("user already exist");
    }
    const isFirstUser = (yield userModel_1.default.countDocuments({})) === 0;
    if (isFirstUser) {
        req.body.role = "admin";
        req.body.approved = "true";
    }
    req.body.password = yield (0, auth_1.encode)(password);
    yield userModel_1.default.create(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "user created" });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = req.body;
    const userExists = yield userModel_1.default.findOne({ userName });
    if (!userExists)
        throw new customErrors_1.NotFoundError("user does not exist");
    const passwordCorrect = yield (0, auth_1.confirmPassword)(password, userExists.password);
    if (!passwordCorrect)
        throw new customErrors_1.UnauthenticatedError("Authentication invalid");
    const payload = {
        _id: userExists._id,
        userName: userExists.userName,
        role: userExists.role,
        approved: userExists.approved,
    };
    const token = (0, tokenUtils_1.createJwt)(payload);
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + oneDay),
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "user logged in" });
});
exports.login = login;
const logout = (req, res) => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Logged out..." });
};
exports.logout = logout;
// FORGOT PASSWORD
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password, confirmPassword } = req.body;
    if (!userName || !password || !confirmPassword)
        throw new customErrors_1.BadRequestError("Please provide all values");
    if (password !== confirmPassword)
        throw new customErrors_1.BadRequestError("Passwords must match");
    const user = yield userModel_1.default.findOne({ userName });
    if (!user)
        throw new customErrors_1.NotFoundError("User does not exist. Create account.");
    const newPassword = yield (0, auth_1.encode)(password);
    user.password = newPassword;
    yield user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Password changed. Login to account" });
});
exports.forgotPassword = forgotPassword;
//# sourceMappingURL=authControllers.js.map