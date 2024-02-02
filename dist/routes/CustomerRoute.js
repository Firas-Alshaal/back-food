"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const CustomerController_1 = require("../controllers/CustomerController");
const commonAuth_1 = require("../middleware/commonAuth");
const router = express_1.default.Router();
exports.CustomerRoute = router;
router.post("/signup", CustomerController_1.customerSignup);
router.post("/login", CustomerController_1.customerLogin);
router.put("/verify", commonAuth_1.Authenticate, CustomerController_1.customerVerify);
router.get("/otp", commonAuth_1.Authenticate, CustomerController_1.customerRequestOTP);
router.get("/profile", commonAuth_1.Authenticate, CustomerController_1.getCustomerProfile);
router.put("/profile", commonAuth_1.Authenticate, CustomerController_1.editCustomerProfile);
//# sourceMappingURL=CustomerRoute.js.map