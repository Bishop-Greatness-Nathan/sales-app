"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv.config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const app = (0, express_1.default)();
// middlewares
const notFound_1 = __importDefault(require("./middleware/notFound"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const authMiddleware_1 = require("./middleware/authMiddleware");
// routers
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const storeRoutes_1 = __importDefault(require("./routes/storeRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const cashRoutes_1 = __importDefault(require("./routes/cashRoutes"));
const bankRoutes_1 = __importDefault(require("./routes/bankRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const endOfDayRoutes_1 = __importDefault(require("./routes/endOfDayRoutes"));
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// app.use(express.static(path.resolve(__dirname, "./public")))
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../front-end/dist")));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
app.use("/api/v1/auth", authRoutes_1.default);
app.use("/api/v1/user", authMiddleware_1.authenticateUser, userRoutes_1.default);
app.use("/api/v1/product", authMiddleware_1.authenticateUser, productRoutes_1.default);
app.use("/api/v1/order", authMiddleware_1.authenticateUser, orderRoutes_1.default);
app.use("/api/v1/expense", authMiddleware_1.authenticateUser, expenseRoutes_1.default);
app.use("/api/v1/store", authMiddleware_1.authenticateUser, storeRoutes_1.default);
app.use("/api/v1/customer", authMiddleware_1.authenticateUser, customerRoutes_1.default);
app.use("/api/v1/cash", authMiddleware_1.authenticateUser, cashRoutes_1.default);
app.use("/api/v1/bank", authMiddleware_1.authenticateUser, bankRoutes_1.default);
app.use("/api/v1/category", authMiddleware_1.authenticateUser, categoryRoutes_1.default);
app.use("/api/v1/endofday", authMiddleware_1.authenticateUser, endOfDayRoutes_1.default);
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "./public", "index.html"))
// })
app.get("*", (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../front-end", "index.html"));
});
// app.use("*", (req, res) => {
//   res.status(404).json({ msg: "not found" })
// })
app.use(notFound_1.default);
app.use(errorHandler_1.default);
const port = process.env.PORT || 4000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.MONGO_URL);
        app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("connected to DB");
            console.log(`server is listening on port ${port}`);
        }));
    }
    catch (error) {
        console.log(error);
    }
});
start();
//# sourceMappingURL=index.js.map