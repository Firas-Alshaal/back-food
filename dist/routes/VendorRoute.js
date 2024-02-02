"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const VendorController_1 = require("../controllers/VendorController");
const commonAuth_1 = require("../middleware/commonAuth");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.VendorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/images");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "_" + file.originalname);
    },
});
const images = (0, multer_1.default)({ storage: imageStorage }).array("images", 10);
router.post("/login", VendorController_1.vendorLogin);
router.get("/profile", commonAuth_1.Authenticate, VendorController_1.getVendorProfile);
router.put("/profile", commonAuth_1.Authenticate, VendorController_1.updateVendorProfile);
router.put("/coverImage", commonAuth_1.Authenticate, images, VendorController_1.updateVendorCoverImage);
router.put("/service", commonAuth_1.Authenticate, VendorController_1.updateVendorService);
router.post("/food", commonAuth_1.Authenticate, images, VendorController_1.addVendorFood);
router.get("/foods", commonAuth_1.Authenticate, VendorController_1.getVendorFoods);
router.get("/", (req, res, next) => {
    res.json({ message: "Hello from vendor" });
});
//# sourceMappingURL=VendorRoute.js.map