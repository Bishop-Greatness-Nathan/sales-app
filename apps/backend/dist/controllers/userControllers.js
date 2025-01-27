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
exports.approveUser = exports.changePassword = exports.updateUser = exports.singleUser = exports.currentUser = exports.allUsers = void 0;
const customErrors_1 = require("../errors/customErrors");
const userModel_1 = __importDefault(require("../models/userModel"));
const http_status_codes_1 = require("http-status-codes");
const auth_1 = require("../utils/auth");
// GET ALL USERS
const allUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not permitted to perform this task");
    const users = yield userModel_1.default.find({}).select("-password");
    res.status(http_status_codes_1.StatusCodes.OK).json({ users });
});
exports.allUsers = allUsers;
// GET CURRENT USER
const currentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const user = yield userModel_1.default.findOne({ _id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId }).select("-password");
    if (!user)
        throw new customErrors_1.UnauthenticatedError("Invalid credentials");
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.currentUser = currentUser;
// GET SINGLE USER
const singleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if (req.user?.role !== "admin")
    //   throw new UnAuthorizedError("Not permitted to perform this task")
    if (!req.params.id)
        throw new customErrors_1.BadRequestError("Params not provided");
    const user = yield userModel_1.default.findById(req.params.id).select("-password");
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
});
exports.singleUser = singleUser;
// UPDATE USER
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const { firstName, lastName, userName } = req.body;
    if (!firstName || !lastName || !userName)
        throw new customErrors_1.BadRequestError("Please provide all values");
    const user = yield userModel_1.default.findOne({ _id: req.params.id });
    if (!user)
        throw new customErrors_1.NotFoundError(`No user found with id: ${req.params.id}`);
    if (String((_c = req.user) === null || _c === void 0 ? void 0 : _c.userId) !== String(user._id) &&
        ((_d = req.user) === null || _d === void 0 ? void 0 : _d.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not permitted to perform this task");
    const updatedUser = yield userModel_1.default.findOneAndUpdate({ _id: user._id }, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ updatedUser });
});
exports.updateUser = updateUser;
// CHANGE PASSWORD
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
        throw new customErrors_1.BadRequestError("Please provide all values");
    if (oldPassword === newPassword)
        throw new customErrors_1.BadRequestError("Passwords must be different");
    const user = yield userModel_1.default.findOne({ _id: (_e = req.user) === null || _e === void 0 ? void 0 : _e.userId });
    if (!user)
        throw new customErrors_1.NotFoundError("User does not exist");
    const passwordCorrect = yield (0, auth_1.confirmPassword)(oldPassword, user.password);
    if (!passwordCorrect)
        throw new customErrors_1.UnauthenticatedError("Authentication invalid");
    req.body.newPassword = yield (0, auth_1.encode)(newPassword);
    user.password = req.body.newPassword;
    yield user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Password changed" });
});
exports.changePassword = changePassword;
// APPROVE USER
const approveUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    if (((_f = req.user) === null || _f === void 0 ? void 0 : _f.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Unauthorized to perform this task");
    const user = yield userModel_1.default.findById(req.params.id);
    if (!user)
        throw new customErrors_1.NotFoundError("user not found");
    let approval;
    if (user.approved === true) {
        approval = false;
    }
    else {
        approval = true;
    }
    yield userModel_1.default.findByIdAndUpdate(req.params.id, { approved: approval }, { runValidators: true, new: true });
});
exports.approveUser = approveUser;
//# sourceMappingURL=userControllers.js.map