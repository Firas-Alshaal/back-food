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
exports.editCustomerProfile = exports.getCustomerProfile = exports.customerRequestOTP = exports.customerVerify = exports.customerLogin = exports.customerSignup = void 0;
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const class_validator_1 = require("class-validator");
const passwordUtility_1 = require("../utility/passwordUtility");
const customer_1 = require("../models/customer");
const notificationUtility_1 = require("../utility/notificationUtility");
const customerSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInput, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInput);
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, password, phone } = customerInput;
    var salt = yield (0, passwordUtility_1.GenerateSalt)();
    const userPassword = yield (0, passwordUtility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, notificationUtility_1.GenerateOTP)();
    const existCustomer = yield customer_1.Customer.findOne({ email: email });
    if (existCustomer) {
        return res.status(409).json({ message: "That user already exist" });
    }
    const result = yield customer_1.Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expire: expiry,
        lastName: "",
        firstName: "",
        address: "",
        verified: false,
        lat: 0,
        lng: 0,
        orders: [],
    });
    if (result) {
        yield (0, notificationUtility_1.onRequestOTP)(otp, phone);
        const signature = (0, passwordUtility_1.generateSignature)({
            _id: result._id,
            email: result.email,
            verified: result.verified,
        });
        return res.status(201).json({
            signature: signature,
            email: result.email,
            verified: result.verified,
        });
    }
    return res.status(400).json({ message: "Error with signup" });
});
exports.customerSignup = customerSignup;
const customerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.LoginCustomerInput, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInput);
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, password } = customerInput;
    const existCustomer = yield customer_1.Customer.findOne({ email: email });
    if (existCustomer) {
        const signature = (0, passwordUtility_1.generateSignature)({
            _id: existCustomer._id,
            email: existCustomer.email,
            verified: existCustomer.verified,
        });
        const isPassword = yield (0, passwordUtility_1.ValidatePassword)(password, existCustomer.password, existCustomer.salt);
        if (isPassword) {
            return res.status(201).json({
                signature: signature,
            });
        }
        else {
            return res.status(400).json({ message: "Error with Password" });
        }
    }
    return res.status(404).json({ message: "That user don't exist" });
});
exports.customerLogin = customerLogin;
const customerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = yield customer_1.Customer.findById({ _id: customer._id });
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expire >= new Date()) {
                profile.verified = true;
                const updateCustomerResponse = yield profile.save();
                const signature = (0, passwordUtility_1.generateSignature)({
                    _id: updateCustomerResponse._id,
                    email: updateCustomerResponse.email,
                    verified: updateCustomerResponse.verified,
                });
                return res.status(201).json({
                    signature: signature,
                    email: updateCustomerResponse.email,
                    verified: updateCustomerResponse.verified,
                });
            }
        }
    }
    return res.status(400).json({ message: "Error with OTP validation" });
});
exports.customerVerify = customerVerify;
const customerRequestOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield customer_1.Customer.findById({ _id: customer._id });
        if (profile) {
            const { otp, expiry } = (0, notificationUtility_1.GenerateOTP)();
            profile.otp = otp;
            profile.otp_expire = expiry;
            yield profile.save();
            yield (0, notificationUtility_1.onRequestOTP)(otp, profile.phone);
            return res.status(200).json({ message: "Otp has resend" });
        }
    }
    return res.status(400).json({ message: "Error with OTP validation" });
});
exports.customerRequestOTP = customerRequestOTP;
const getCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield customer_1.Customer.findById({ _id: customer._id });
        if (profile) {
            return res.status(200).json({ profile });
        }
    }
    return res.status(400).json({ message: "Error with get profile" });
});
exports.getCustomerProfile = getCustomerProfile;
const editCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    const customerInput = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInput, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInput);
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { firstName, lastName, address } = customerInput;
    if (customer) {
        const profile = yield customer_1.Customer.findById({ _id: customer._id });
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            yield profile.save();
            return res.status(200).json({ profile });
        }
    }
    return res.status(400).json({ message: "Error with edit profile" });
});
exports.editCustomerProfile = editCustomerProfile;
//# sourceMappingURL=CustomerController.js.map