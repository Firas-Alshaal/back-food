import express from "express";
import {
  createOrder,
  getOrderById,
  getOrders,
  getOrderProcess,
  getCurrentOrders,
} from "../controllers/OrderController";
import { Authenticate } from "../middleware/commonAuth";

const router = express.Router();

router.post("/create-order", Authenticate, createOrder);
router.get("/orders", Authenticate, getOrders);
router.get("/order/:id", Authenticate, getOrderById);

router.put("/order/:id/process", Authenticate, getOrderProcess);
router.get("/vendor-orders", Authenticate, getCurrentOrders);
// router.get("/order/:id", Authenticate, getOrderById);

export { router as OrderRoute };
