import express from "express";
import {
  createCart,
  getCarts,
  deleteCart,
} from "../controllers/CartController";
import { Authenticate } from "../middleware/commonAuth";

const router = express.Router();

router.post("/create-cart", Authenticate, createCart);
router.get("/carts", Authenticate, getCarts);
router.delete("/carts", Authenticate, deleteCart);

export { router as CartRoute };
