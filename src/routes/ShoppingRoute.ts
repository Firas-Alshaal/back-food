import express from "express";
import {
  getFoodAvailability,
  getFoodIn30Min,
  getTopRestaurant,
  restaurantById,
  searchFoods,
} from "../controllers/ShoppingController";

const router = express.Router();

router.get("/:pincode", getFoodAvailability);
router.get("/top-restaurants/:pincode", getTopRestaurant);
router.get("/foods-in-30-min/:pincode", getFoodIn30Min);
router.get("/search/:pincode", searchFoods);
router.get("/restaurant/:id", restaurantById);

export { router as ShoppingRoute };
