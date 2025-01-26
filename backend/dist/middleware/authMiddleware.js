"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const customErrors_1 = require("../errors/customErrors");
const tokenUtils_1 = require("../utils/tokenUtils");
const authenticateUser = (req, // use the extended interface
res, next) => {
    const { token } = req.cookies;
    if (!token)
        throw new customErrors_1.UnauthenticatedError("Invalid credentials");
    const payload = (0, tokenUtils_1.verifyJwt)(token);
    if (typeof payload === "string")
        throw new customErrors_1.UnauthenticatedError("invalid token payload");
    req.user = {
        userId: payload._id,
        userName: payload.userName,
        role: payload.role,
        approved: payload.approved,
    };
    next();
};
exports.authenticateUser = authenticateUser;
//# sourceMappingURL=authMiddleware.js.map