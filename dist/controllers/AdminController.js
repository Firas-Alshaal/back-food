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
exports.getVendorById = exports.getVendor = exports.createVendor = exports.findVendor = void 0;
const vendor_1 = require("../models/vendor");
const passwordUtility_1 = require("../utility/passwordUtility");
const findVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield vendor_1.Vendor.findOne({ email: email });
    }
    else {
        return yield vendor_1.Vendor.findById({ _id: id });
    }
});
exports.findVendor = findVendor;
const createVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, pinCode, foodType, password, email, ownerName, phone, } = req.body;
    const existingVendor = yield (0, exports.findVendor)("", email);
    if (existingVendor !== null) {
        return res.json({ message: "A vendor is exist in database" });
    }
    const salt = yield (0, passwordUtility_1.GenerateSalt)();
    const userPassword = yield (0, passwordUtility_1.GeneratePassword)(password, salt);
    const createVendor = yield vendor_1.Vendor.create({
        name: name,
        address: address,
        pinCode: pinCode,
        foodType: foodType,
        password: userPassword,
        email: email,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: [],
        foods: [],
    });
    return res.json(createVendor);
});
exports.createVendor = createVendor;
const getVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield vendor_1.Vendor.find();
    if (vendors !== null) {
        return res.json(vendors);
    }
    return res.json({ message: "Not found" });
});
exports.getVendor = getVendor;
const getVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.id;
    const vendors = yield (0, exports.findVendor)(vendorId);
    if (vendors !== null) {
        return res.json(vendors);
    }
    return res.json({ message: "Not found" });
});
exports.getVendorById = getVendorById;
//# sourceMappingURL=AdminController.js.map