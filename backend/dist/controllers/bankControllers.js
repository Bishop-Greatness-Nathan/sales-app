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
exports.deleteBankRecord = exports.updateBankRecord = exports.singleBankRecord = exports.allBankRecords = exports.createBankRecord = void 0;
const bankModel_1 = __importDefault(require("../models/bankModel"));
const cashModel_1 = __importDefault(require("../models/cashModel"));
const http_status_codes_1 = require("http-status-codes");
const customErrors_1 = require("../errors/customErrors");
const dayjs_1 = __importDefault(require("dayjs"));
const createBankRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { amount, remark, action } = req.body;
    if (!amount || !remark || !action)
        throw new customErrors_1.BadRequestError("please enter all values");
    const enteredAt = (0, dayjs_1.default)(new Date(Date.now())).format("YYYY-MM-DD");
    const enteredBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userName;
    if (action === "to cash") {
        yield cashModel_1.default.create({
            amount,
            remark: "Cash withdrawn from bank",
            action: "add",
            enteredBy,
            enteredAt,
        });
        yield bankModel_1.default.create({
            amount,
            remark,
            action: "release",
            enteredBy,
            enteredAt,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "record created" });
        return;
    }
    yield bankModel_1.default.create({
        amount,
        remark,
        action,
        enteredBy,
        enteredAt,
    });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "record created" });
});
exports.createBankRecord = createBankRecord;
const allBankRecords = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to } = req.query;
    const queryObject = {
        enteredAt: { $gte: "", $lte: "" },
    };
    if (from && to) {
        queryObject.enteredAt = { $gte: from, $lte: to };
    }
    const bank = yield bankModel_1.default.find(queryObject).sort({ createdAt: -1 });
    // calculate total balance
    const allBank = yield bankModel_1.default.find({});
    const totals = allBank.reduce((total, bank) => {
        if (bank.action === "add")
            total.add += bank.amount || 0;
        if (bank.action === "release")
            total.release += bank.amount || 0;
        return total;
    }, { add: 0, release: 0 });
    const bankBalance = totals.add - totals.release;
    res.status(http_status_codes_1.StatusCodes.OK).json({ bank, balance: bankBalance });
});
exports.allBankRecords = allBankRecords;
const singleBankRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("single bank record");
});
exports.singleBankRecord = singleBankRecord;
const updateBankRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("update bank record");
});
exports.updateBankRecord = updateBankRecord;
const deleteBankRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("delete bank record");
});
exports.deleteBankRecord = deleteBankRecord;
//# sourceMappingURL=bankControllers.js.map