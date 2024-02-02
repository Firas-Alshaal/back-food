import express, { Request, Response, NextFunction } from "express";
import { createVendor, getVendor, getVendorById } from "../controllers/index";

const router = express.Router();

router.post("/vendor", createVendor);
router.get("/vendors", getVendor);
router.get("/vendor/:id", getVendorById);

export { router as AdminRoute };
