"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissions = void 0;
const customErrors_1 = require("../errors/customErrors");
const permissions = (req, res, next) => {
    var _a, _b;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin" && !((_b = req.user) === null || _b === void 0 ? void 0 : _b.approved))
        throw new customErrors_1.UnAuthorizedError("Not authorized to perform this operation");
    next();
};
exports.permissions = permissions;
//# sourceMappingURL=permissions.js.map