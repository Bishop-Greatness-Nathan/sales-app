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
exports.returnItem = exports.getProfit = exports.updateOrder = exports.deleteOrder = exports.singleOrder = exports.getAllOrders = exports.createOrder = void 0;
const customErrors_1 = require("../errors/customErrors");
const orderModel_1 = __importDefault(require("../models/orderModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const customerModel_1 = __importDefault(require("../models/customerModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const expensesModel_1 = __importDefault(require("../models/expensesModel"));
const http_status_codes_1 = require("http-status-codes");
const dayjs_1 = __importDefault(require("dayjs"));
const cashModel_1 = __importDefault(require("../models/cashModel"));
const bankModel_1 = __importDefault(require("../models/bankModel"));
const methods_1 = require("../utils/methods");
// CREATE ORDER
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { total, items, balance, cash, bank, usedPoints, customer } = req.body;
    if (!total || !items)
        throw new customErrors_1.NotFoundError("Missing fields");
    req.body.enteredAt = (0, dayjs_1.default)(new Date(Date.now())).format("YYYY-MM-DD");
    const orderItems = items;
    let points = 0;
    // add customer debt
    if (balance > 0 && customer.phoneNumber !== "") {
        const existingCustomer = yield customerModel_1.default.findOne({
            _id: customer._id,
        });
        if (!existingCustomer)
            throw new customErrors_1.NotFoundError("customer not found");
        existingCustomer.debt += Number(balance);
        yield existingCustomer.save();
    }
    // loyalty points
    if (balance === 0 && customer.phoneNumber !== "" && usedPoints === 0) {
        const existingCustomer = yield customerModel_1.default.findOne({ _id: customer._id });
        if (!existingCustomer)
            throw new customErrors_1.NotFoundError("customer not found");
        points = total * 0.005;
        existingCustomer.points = Number(existingCustomer.points) + points;
        yield existingCustomer.save();
    }
    // points usage
    if (usedPoints > 0 &&
        balance === 0 &&
        cash === 0 &&
        bank === 0 &&
        customer.phoneNumber !== "") {
        const existingCustomer = yield customerModel_1.default.findOne({ _id: customer._id });
        if (!existingCustomer)
            throw new customErrors_1.NotFoundError("customer not found");
        if (existingCustomer.debt > 0) {
            throw new customErrors_1.BadRequestError("this customer is a debtor");
        }
        if (existingCustomer.pointsUsage < 2) {
            existingCustomer.points -= Number(usedPoints);
            existingCustomer.pointsUsage += 1;
        }
        else {
            throw new customErrors_1.BadRequestError("this customer has exceeded points usage for the month");
        }
        yield existingCustomer.save();
    }
    // check for correct product
    for (let orderItem of orderItems) {
        let existingItem = yield productModel_1.default.findOne({ _id: orderItem.productId });
        if (!existingItem)
            throw new customErrors_1.NotFoundError(`No product with id: ${orderItem.productId}`);
        // update inventory
        existingItem.qty -= orderItem.pcs;
        yield productModel_1.default.findOneAndUpdate({ _id: orderItem.productId }, { qty: existingItem.qty }, { new: true, runValidators: true });
    }
    yield orderModel_1.default.create({
        total,
        orderItems,
        balance,
        cash,
        bank,
        usedPoints,
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        customer,
        points,
        enteredAt: req.body.enteredAt,
    });
    if (cash > 0) {
        yield cashModel_1.default.create({
            amount: cash,
            enteredBy: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userName,
            enteredAt: req.body.enteredAt,
        });
    }
    if (bank > 0) {
        yield bankModel_1.default.create({
            amount: bank,
            enteredBy: (_c = req.user) === null || _c === void 0 ? void 0 : _c.userName,
            enteredAt: req.body.enteredAt,
        });
    }
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "Order Created" });
});
exports.createOrder = createOrder;
// GET ALL ORDERS
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, userId } = req.query;
    let queryObject = {
        enteredAt: { $gte: "", $lte: "" },
    };
    if (from && to && userId === "all") {
        queryObject = { enteredAt: { $gte: from, $lte: to } };
    }
    else {
        queryObject = {
            enteredAt: { $gte: from, $lte: to },
            userId: userId,
        };
    }
    const orders = yield orderModel_1.default.find(queryObject)
        .sort({
        createdAt: -1,
    })
        .lean();
    const expenses = yield expensesModel_1.default.find(queryObject)
        .sort({ createdAt: -1 })
        .lean();
    const analysis = (0, methods_1.calculateProfit)(orders, expenses);
    res.status(http_status_codes_1.StatusCodes.OK).json({ count: orders.length, orders, analysis });
});
exports.getAllOrders = getAllOrders;
// GET SINGLE ORDER
const singleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_1.default.findOne({ _id: req.params.id });
    if (!order)
        throw new customErrors_1.NotFoundError("This order does not exist");
    const user = yield userModel_1.default.findOne({ _id: order.userId });
    if (!user)
        throw new customErrors_1.NotFoundError("No user found");
    res.status(http_status_codes_1.StatusCodes.OK).json({ soldBy: user.firstName, order });
});
exports.singleOrder = singleOrder;
// DELETE ORDER .... THIS WILL NOT BE CARRIED OUT THOUGH
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not Permitted");
    const order = yield orderModel_1.default.findOne({ _id: req.params.id });
    if (!order)
        throw new customErrors_1.NotFoundError(`No order found with id: ${req.params.id}`);
    for (let item of order.orderItems) {
        const product = yield productModel_1.default.findOne({ _id: item.productId });
        if (!product)
            throw new customErrors_1.NotFoundError("Product does not exist");
        product.qty += item.pcs;
        yield productModel_1.default.findOneAndUpdate({ _id: item.productId }, { qty: product.qty }, { new: true, runValidators: true });
    }
    yield orderModel_1.default.findOneAndDelete({ _id: req.params.id });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Order deleted" });
});
exports.deleteOrder = deleteOrder;
// UPDATE ORDER
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const { amountPaid, paymentType } = req.body;
    const enteredAt = (0, dayjs_1.default)(new Date(Date.now())).format("YYYY-MM-DD");
    const order = yield orderModel_1.default.findById(req.params.id);
    if (!order)
        throw new customErrors_1.NotFoundError("order not found");
    yield orderModel_1.default.findByIdAndUpdate(req.params.id, Object.assign({}, req.body), { runValidators: true, new: true });
    if (amountPaid && amountPaid > 0) {
        const customer = yield customerModel_1.default.findOne({ _id: (_a = order.customer) === null || _a === void 0 ? void 0 : _a._id });
        if (!customer)
            throw new customErrors_1.NotFoundError("Customer not found");
        customer.debt = Number(customer.debt) - Number(amountPaid);
        yield customer.save();
    }
    if (paymentType === "cash" && amountPaid > 0) {
        yield cashModel_1.default.create({
            amount: amountPaid,
            enteredBy: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userName,
            enteredAt: enteredAt,
            remark: `Cash received from debt paid by ${(_c = order.customer) === null || _c === void 0 ? void 0 : _c.firstName} ${(_d = order.customer) === null || _d === void 0 ? void 0 : _d.lastName}`,
        });
    }
    if (paymentType === "bank" && amountPaid > 0) {
        yield bankModel_1.default.create({
            amount: amountPaid,
            enteredBy: (_e = req.user) === null || _e === void 0 ? void 0 : _e.userName,
            enteredAt: enteredAt,
            remark: `Money received from debt paid by ${(_f = order.customer) === null || _f === void 0 ? void 0 : _f.firstName} ${(_g = order.customer) === null || _g === void 0 ? void 0 : _g.lastName}`,
        });
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "order updated" });
});
exports.updateOrder = updateOrder;
// CALCULATE PROFIT
const getProfit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let grossProfit = 0;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not permitted to perform this task");
    const orders = yield orderModel_1.default.find({});
    for (let order of orders) {
        for (let item of order.orderItems) {
            if (!item.returned) {
                grossProfit += item.diff;
            }
        }
    }
    const expenses = yield expensesModel_1.default.find({});
    const totalExpenses = expenses.reduce((total, value) => {
        total += value.amount;
        return total;
    }, 0);
    const analysis = {
        grossProfit,
        totalExpenses,
        netProfit: grossProfit - totalExpenses,
    };
    res.status(http_status_codes_1.StatusCodes.OK).json({ analysis });
});
exports.getProfit = getProfit;
// RETURN ITEM
const returnItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const enteredAt = (0, dayjs_1.default)(new Date(Date.now())).format("YYYY-MM-DD");
    const enteredBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userName;
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not permitted");
    const { newDiff, subTotal, returned, returnType, productId, price, pcs } = req.body;
    console.log(price);
    const { orderId, itemId } = req.query;
    if (!orderId || !itemId)
        throw new customErrors_1.UnauthenticatedError("Invalid credentials");
    const order = yield orderModel_1.default.findOne({ _id: orderId });
    if (!order)
        throw new customErrors_1.NotFoundError("Order does not exist");
    // update product
    const product = yield productModel_1.default.findOne({ _id: productId });
    if (!product)
        throw new customErrors_1.NotFoundError("This product does not exist");
    product.qty = product.qty + returned;
    yield product.save();
    // edit order items
    const quantity = pcs - returned;
    const newOrderItems = order.orderItems.map((item) => {
        if (String(item._id) === itemId) {
            item.returned += Number(returned);
            item.pcs = Number(quantity);
            item.subTotal = Number(subTotal);
            item.diff = Number(newDiff);
        }
        return item;
    });
    // check cash
    const cashValue = returnType === "cash"
        ? Number(order.cash) - Number(price * returned)
        : Number(order.cash);
    // check bank
    const bankValue = returnType === "bank"
        ? Number(order.bank) - Number(price * returned)
        : Number(order.bank);
    // calculate new order total
    const newTotal = Number(order.total) - Number(price * returned);
    // calculate points
    const newPoints = Number(newTotal * 0.005);
    // update order
    const updatedOrder = yield orderModel_1.default.findOneAndUpdate({ _id: orderId }, {
        orderItems: newOrderItems,
        total: newTotal,
        cash: cashValue,
        bank: bankValue,
        points: newPoints,
    }, { new: true, runValidators: true });
    // update customer points
    const customer = yield customerModel_1.default.findOne({ _id: (_c = order.customer) === null || _c === void 0 ? void 0 : _c._id });
    if (customer) {
        const returnedItemPrice = Number(price * returned);
        customer.points -= returnedItemPrice * 0.005;
        yield customer.save();
    }
    // create new cash record
    if (returnType === "cash") {
        yield cashModel_1.default.create({
            amount: Number(price * returned),
            remark: "Cash given for returned goods",
            action: "release",
            enteredAt,
            enteredBy,
        });
    }
    // create new bank record
    if (returnType === "bank") {
        yield bankModel_1.default.create({
            amount: Number(price * returned),
            remark: "Money transfered for returned goods",
            action: "release",
            enteredAt,
            enteredBy,
        });
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ updatedOrder });
});
exports.returnItem = returnItem;
//# sourceMappingURL=orderControllers.js.map