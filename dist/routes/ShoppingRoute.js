"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
const express_1 = __importDefault(require("express"));
const ShoppingController_1 = require("../controllers/ShoppingController");
const router = express_1.default.Router();
exports.ShoppingRoute = router;
router.get("/:pincode", ShoppingController_1.getFoodAvailability);
router.get("/top-restaurants/:pincode", ShoppingController_1.getTopRestaurant);
router.get("/foods-in-30-min/:pincode", ShoppingController_1.getFoodIn30Min);
router.get("/search/:pincode", ShoppingController_1.searchFoods);
router.get("/restaurant/:id", ShoppingController_1.restaurantById);
//# sourceMappingURL=ShoppingRoute.js.map