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
exports.getEndOfDay = exports.createEndOfDay = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const endOfDayModel_1 = __importDefault(require("../models/endOfDayModel"));
const dayjs_1 = __importDefault(require("dayjs"));
const http_status_codes_1 = require("http-status-codes");
const methods_1 = require("../utils/methods");
const createEndOfDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = (0, dayjs_1.default)(new Date(Date.now())).format("YYYY-MM-DD");
    const products = yield productModel_1.default.find({});
    const stockExists = yield endOfDayModel_1.default.findOne({ date: today });
    if (stockExists) {
        yield endOfDayModel_1.default.findOneAndReplace({ date: today }, { date: today, products }, { returnOriginal: false });
        return;
    }
    yield endOfDayModel_1.default.create({ date: today, products });
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "end of day created" });
});
exports.createEndOfDay = createEndOfDay;
const getEndOfDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date(Date.now()).getTime();
    const _40days = 40 * 24 * 60 * 60 * 1000;
    const newDate = today - _40days;
    const calculated = (0, dayjs_1.default)(new Date(newDate)).format("YYYY-MM-DD");
    yield endOfDayModel_1.default.deleteMany({ date: { $lt: calculated } });
    const { date, product: name, category } = req.query;
    let stock = yield endOfDayModel_1.default.findOne({ date });
    stock === null || stock === void 0 ? void 0 : stock.products.sort((a, b) => a.name.localeCompare(b.name));
    if (!stock) {
        res.status(http_status_codes_1.StatusCodes.OK).json({ products: null });
    }
    else {
        if (category === "All Products" && name === "All Products") {
            const products = stock.products;
            const worth = (0, methods_1.getWorth)(products);
            res.status(http_status_codes_1.StatusCodes.OK).json({ products, worth });
            return;
        }
        else if (category === "All Products" && name !== "All Products") {
            const products = stock.products.filter((product) => product.name === name);
            const worth = (0, methods_1.getWorth)(products);
            res.status(http_status_codes_1.StatusCodes.OK).json({ products, worth });
            return;
        }
        else if (category !== "All Products" && name === "All Products") {
            const products = stock.products.filter((product) => product.category === category);
            const worth = (0, methods_1.getWorth)(products);
            res.status(http_status_codes_1.StatusCodes.OK).json({ products, worth });
            return;
        }
        else {
            const products = stock.products.filter((product) => product.category === category && product.name === name);
            const worth = (0, methods_1.getWorth)(products);
            res.status(http_status_codes_1.StatusCodes.OK).json({ products, worth });
            return;
        }
    }
});
exports.getEndOfDay = getEndOfDay;
//# sourceMappingURL=endOfDayControllers.js.map