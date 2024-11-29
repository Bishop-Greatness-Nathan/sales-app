"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
    let customError = {
        // set default
        statusCode: (err === null || err === void 0 ? void 0 : err.statusCode) || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong try again later",
    };
    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
        customError.statusCode = 400;
    }
    return res.status(customError.statusCode).json({ msg: customError.msg });
    // const statusCode =
    //   (err as any)?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    // const msg: string = err.message || "Something went wrong, try again later"
    // res.status(statusCode).json({ msg })
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map