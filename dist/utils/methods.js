"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateProfit = exports.getStoreWorth = exports.getWorth = void 0;
// products worth
const getWorth = (products) => {
    return products.reduce((total, value) => {
        total.totalCost += value.qty * value.CP;
        total.totalWorth += value.qty * value.SP;
        return total;
    }, { totalCost: 0, totalWorth: 0 });
};
exports.getWorth = getWorth;
// store products worth
const getStoreWorth = (products) => {
    return products.reduce((total, value) => {
        total.totalCost += value.CP * value.store;
        total.totalWorth += value.SP * value.store;
        return total;
    }, { totalCost: 0, totalWorth: 0 });
};
exports.getStoreWorth = getStoreWorth;
// calculate profit
const calculateProfit = (orders, expenses) => {
    let grossProfit = 0;
    let totalReturned = 0;
    orders.forEach((order) => {
        order.orderItems.forEach((item) => {
            grossProfit += item.diff;
            if (item.returned > 0) {
                totalReturned += item.price * item.returned;
            }
        });
    });
    const allExpenses = expenses.reduce((total, value) => {
        total += value.amount;
        return total;
    }, 0);
    const totals = orders === null || orders === void 0 ? void 0 : orders.reduce((total, order) => {
        total.totalOrders += order.total;
        if (order.cash !== undefined)
            total.totalCash += order.cash;
        if (order.bank !== undefined)
            total.totalBank += order.bank;
        return total;
    }, { totalOrders: 0, totalCash: 0, totalBank: 0 });
    const analysis = {
        total: totals.totalOrders,
        totalBank: totals.totalBank,
        totalCash: totals.totalCash,
        totalReturned,
        grossProfit,
        expenses: allExpenses,
        netProfit: grossProfit - allExpenses,
    };
    return analysis;
};
exports.calculateProfit = calculateProfit;
//# sourceMappingURL=methods.js.map