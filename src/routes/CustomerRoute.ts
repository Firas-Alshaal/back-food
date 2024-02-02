import express from "express";
import {
  customerSignup,
  customerLogin,
  customerVerify,
  customerRequestOTP,
  getCustomerProfile,
  editCustomerProfile,
} from "../controllers/CustomerController";
import { Authenticate } from "../middleware/commonAuth";

const router = express.Router();

router.post("/signup", customerSignup);
router.post("/login", customerLogin);
router.put("/verify", Authenticate, customerVerify);
router.get("/otp", Authenticate, customerRequestOTP);
router.get("/profile", Authenticate, getCustomerProfile);
router.put("/profile", Authenticate, editCustomerProfile);

export { router as CustomerRoute };
