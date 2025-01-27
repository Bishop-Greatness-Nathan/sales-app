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
exports.deleteCashRecord = exports.updateCashRecord = exports.singleCashRecord = exports.allCashRecords = exports.createCashRecord = void 0;
const cashModel_1 = __importDefault(require("../models/cashModel"));
const bankModel_1 = __importDefault(require("../models/bankModel"));
const http_status_codes_1 = require("http-status-codes");
const customErrors_1 = require("../errors/customErrors");
const dayjs_1 = __importDefault(require("dayjs"));
const createCashRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { amount, remark, action } = req.body;
    if (!amount || !remark || !action)
        throw new customErrors_1.BadRequestError("please enter all values");
    const enteredAt = (0, dayjs_1.default)(new Date(Date.now())).format("YYYY-MM-DD");
    const enteredBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userName;
    if (action === "to bank") {
        yield bankModel_1.default.create({
            amount,
            remark: "Cash paid into bank",
            action: "add",
            enteredBy,
            enteredAt,
        });
        yield cashModel_1.default.create({
            amount,
            remark,
            action: "release",
            enteredAt,
            enteredBy,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "record created" });
        return;
    }
    yield cashModel_1.default.create({ amount, remark, action, enteredAt, enteredBy });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "record created" });
});
exports.createCashRecord = createCashRecord;
const allCashRecords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to } = req.query;
    const queryObject = {
        enteredAt: { $gte: "", $lte: "" },
    };
    if (from && to) {
        queryObject.enteredAt = { $gte: from, $lte: to };
    }
    const cash = yield cashModel_1.default.find(queryObject).sort({ createdAt: -1 });
    // calculate total balance
    const allCash = yield cashModel_1.default.find({});
    const totals = allCash.reduce((total, cash) => {
        if (cash.action === "add")
            total.add += cash.amount || 0;
        if (cash.action === "release")
            total.release += cash.amount || 0;
        return total;
    }, { add: 0, release: 0 });
    const cashBalance = totals.add - totals.release;
    res.status(http_status_codes_1.StatusCodes.OK).json({ cash, balance: cashBalance });
});
exports.allCashRecords = allCashRecords;
const singleCashRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("single cash record");
});
exports.singleCashRecord = singleCashRecord;
const updateCashRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("update cash record");
});
exports.updateCashRecord = updateCashRecord;
const deleteCashRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("delete cash record");
});
exports.deleteCashRecord = deleteCashRecord;
//# sourceMappingURL=cashControllers.js.map