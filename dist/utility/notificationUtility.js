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
exports.onRequestOTP = exports.GenerateOTP = void 0;
const GenerateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, expiry };
};
exports.GenerateOTP = GenerateOTP;
const onRequestOTP = (otp, to) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSid = "AC30756450bc55f7593a9b9df57124bc13";
    const authToken = "cca27794442f417b0ad2c757999d2f25";
    const verifySid = "VAba96b3fc036f59ac02aaa3e1e0211d86";
    const client = require("twilio")(accountSid, authToken);
    return yield client.messages
        .create({
        body: `${otp}`,
        from: "+19492844828",
        to: "+18777804236",
    })
        .catch((error) => console.error(error));
});
exports.onRequestOTP = onRequestOTP;
//# sourceMappingURL=notificationUtility.js.map