import express from "express";
import { createOrder, getOrder } from "../controllers/OrderController";
import { Authenticate } from "../middleware/commonAuth";

const router = express.Router();

router.post("/create-order", Authenticate, createOrder);
router.get("/order", Authenticate, getOrder);

export { router as OrderRoute };
