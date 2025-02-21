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
exports.deleteExpense = exports.updateExpense = exports.singleExpense = exports.allExpenses = exports.createExpense = void 0;
const customErrors_1 = require("../errors/customErrors");
const expensesModel_1 = __importDefault(require("../models/expensesModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const cashModel_1 = __importDefault(require("../models/cashModel"));
const bankModel_1 = __importDefault(require("../models/bankModel"));
const http_status_codes_1 = require("http-status-codes");
const dayjs_1 = __importDefault(require("dayjs"));
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { description, amount, transactionType } = req.body;
    if (!description || !amount || !transactionType)
        throw new customErrors_1.BadRequestError("Please provide all values");
    const enteredAt = (0, dayjs_1.default)(new Date(Date.now())).format("YYYY-MM-DD");
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const user = yield userModel_1.default.findOne({ _id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId });
    if (!user)
        throw new customErrors_1.NotFoundError("user not found");
    const enteredBy = user.firstName;
    if (transactionType === "cash") {
        yield cashModel_1.default.create({
            amount,
            remark: description,
            action: "release",
            enteredBy: (_c = req.user) === null || _c === void 0 ? void 0 : _c.userName,
            enteredAt,
        });
    }
    if (transactionType === "bank") {
        yield bankModel_1.default.create({
            amount,
            remark: description,
            action: "release",
            enteredBy: (_d = req.user) === null || _d === void 0 ? void 0 : _d.userName,
            enteredAt,
        });
    }
    yield expensesModel_1.default.create({ amount, description, enteredBy, enteredAt, userId });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "Expense created" });
});
exports.createExpense = createExpense;
const allExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to } = req.query;
    const queryObject = {
        enteredAt: { $gte: "", $lte: "" },
    };
    if (from && to) {
        queryObject.enteredAt = { $gte: from, $lte: to };
    }
    const expenses = yield expensesModel_1.default.find(queryObject).sort({ createdAt: -1 });
    res.status(http_status_codes_1.StatusCodes.OK).json({ count: expenses.length, expenses });
});
exports.allExpenses = allExpenses;
const singleExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const expense = yield expensesModel_1.default.findById(req.params.id);
    if (!expense)
        throw new customErrors_1.NotFoundError("Expense does not exist");
    const user = yield userModel_1.default.findOne({ _id: expense.userId });
    if (!user)
        throw new customErrors_1.NotFoundError("user not found");
    res.status(http_status_codes_1.StatusCodes.OK).json({ enteredBy: user.firstName, expense });
});
exports.singleExpense = singleExpense;
const updateExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { description, amount } = req.body;
    if (!description || !amount)
        throw new customErrors_1.BadRequestError("Please provide all values");
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not permitted to perform this task");
    yield expensesModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Expense record updated" });
});
exports.updateExpense = updateExpense;
const deleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not permitted to perform this task");
    yield expensesModel_1.default.findOneAndDelete({ _id: req.params.id });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Expense record deleted" });
});
exports.deleteExpense = deleteExpense;
//# sourceMappingURL=expenseControllers.js.map