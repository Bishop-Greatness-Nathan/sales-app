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
exports.deleteCategory = exports.editCategory = exports.getAllCategories = exports.createCategory = void 0;
const customErrors_1 = require("../errors/customErrors");
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const http_status_codes_1 = require("http-status-codes");
// CREATE CATEGORY
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name } = req.body;
    if (!name)
        throw new customErrors_1.BadRequestError("Please provide category name");
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not authorized to perform this operation");
    const alreadyExists = yield categoryModel_1.default.findOne({ name });
    if (alreadyExists)
        throw new customErrors_1.BadRequestError("This category already exists");
    yield categoryModel_1.default.create(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ msg: "category created" });
});
exports.createCategory = createCategory;
// GET ALL CATEGORIES
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield categoryModel_1.default.find({});
    res.status(http_status_codes_1.StatusCodes.OK).json({ categories });
});
exports.getAllCategories = getAllCategories;
// EDIT CATEGORY
const editCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { name } = req.body;
    if (!name)
        throw new customErrors_1.BadRequestError("Please provide category name");
    if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not authorized to perform this operation");
    const category = yield categoryModel_1.default.findById(req.params.id);
    if (!category)
        throw new customErrors_1.NotFoundError(`No category with id: ${req.params.id}`);
    yield categoryModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true,
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "category edited" });
});
exports.editCategory = editCategory;
// DELETE CATEGORY
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    if (((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) !== "admin")
        throw new customErrors_1.UnAuthorizedError("Not authorized to perform this operation");
    const category = yield categoryModel_1.default.findById(req.params.id);
    if (!category)
        throw new customErrors_1.NotFoundError(`No category with id: ${req.params.id}`);
    yield categoryModel_1.default.findByIdAndDelete(req.params.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "category deleted" });
});
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categoryControllers.js.map