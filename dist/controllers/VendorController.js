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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVendorCoverImage = exports.getVendorFoods = exports.addVendorFood = exports.updateVendorService = exports.updateVendorProfile = exports.getVendorProfile = exports.vendorLogin = void 0;
const AdminController_1 = require("./AdminController");
const passwordUtility_1 = require("../utility/passwordUtility");
const food_1 = require("../models/food");
const vendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email } = req.body;
    const existingVendor = yield (0, AdminController_1.findVendor)("", email);
    if (existingVendor) {
        const validation = yield (0, passwordUtility_1.ValidatePassword)(password, existingVendor.password, existingVendor.salt);
        if (validation) {
            const signature = (0, passwordUtility_1.generateSignature)({
                _id: existingVendor._id,
                email: existingVendor.email,
                name: existingVendor.name,
                foodType: existingVendor.foodType,
            });
            return res.json(signature);
        }
        else {
            return res.json({ message: "password not valid" });
        }
    }
    return res.json({ message: "Login credential not valid" });
});
exports.vendorLogin = vendorLogin;
const getVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.findVendor)(user._id);
        return res.json(existingVendor);
    }
    return res.json({ message: "Vendor information not found" });
});
exports.getVendorProfile = getVendorProfile;
const updateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, foodType, address, phone } = req.body;
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.findVendor)(user._id);
        if (existingVendor) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.foodType = foodType;
            existingVendor.phone = phone;
            const saveResult = yield existingVendor.save();
            return res.json(saveResult);
        }
        return res.json({ message: "vendor not exist" });
    }
    return res.json({ message: "user not authorized" });
});
exports.updateVendorProfile = updateVendorProfile;
const updateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.findVendor)(user._id);
        if (existingVendor) {
            existingVendor.serviceAvailable = req.body.serviceAvailable;
            const saveResult = yield existingVendor.save();
            return res.json(saveResult);
        }
        return res.json({ message: "vendor not exist" });
    }
    return res.json({ message: "user not authorized" });
});
exports.updateVendorService = updateVendorService;
const addVendorFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, description, category, foodType, readyTime, price } = req.body;
        const vendor = yield (0, AdminController_1.findVendor)(user._id);
        if (vendor) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            const createFood = yield food_1.Food.create({
                vendorId: vendor._id,
                name: name,
                description: description,
                category: category,
                foodType: foodType,
                readyTime: readyTime,
                price: price,
                images: images,
                rating: 0,
            });
            vendor.foods.push(createFood);
            const result = yield vendor.save();
            return res.json(result);
        }
        return res.json({ message: "vendor not exist" });
    }
    return res.json({ message: "user not authorized" });
});
exports.addVendorFood = addVendorFood;
const getVendorFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield food_1.Food.find({ vendorId: user._id });
        if (foods) {
            return res.json(foods);
        }
    }
    return res.json({ message: "Vendor information not found" });
});
exports.getVendorFoods = getVendorFoods;
const updateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const vendor = yield (0, AdminController_1.findVendor)(user._id);
        if (vendor) {
            const files = req.files;
            const images = files.map((file) => file.filename);
            vendor.coverImages.push(...images);
            const result = yield vendor.save();
            return res.json(result);
        }
        return res.json({ message: "vendor not exist" });
    }
    return res.json({ message: "user not authorized" });
});
exports.updateVendorCoverImage = updateVendorCoverImage;
//# sourceMappingURL=VendorController.js.map