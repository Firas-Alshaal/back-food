import express, { Request, Response, NextFunction } from "express";
import {
  addVendorFood,
  getVendorFoods,
  getVendorProfile,
  updateVendorCoverImage,
  updateVendorProfile,
  updateVendorService,
  vendorLogin,
} from "../controllers/VendorController";
import { Authenticate } from "../middleware/commonAuth";
import multer from "multer";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", vendorLogin);
router.get("/profile", Authenticate, getVendorProfile);
router.put("/profile", Authenticate, updateVendorProfile);
router.put("/coverImage", Authenticate, images, updateVendorCoverImage);
router.put("/service", Authenticate, updateVendorService);

router.post("/food", Authenticate, images, addVendorFood);
router.get("/foods", Authenticate, getVendorFoods);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello from vendor" });
});

export { router as VendorRoute };
