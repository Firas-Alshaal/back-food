import { Request, Response, NextFunction } from "express";
import { Vendor } from "../models/vendor";
import { FoodDoc } from "../models/food";

export const getFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vendor.find({
    pinCode: pincode,
    serviceAvailable: false,
  })
    .sort([["rating", "descending"]])
    .populate("foods")
    .exec();
  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(400).json({ message: "This vendor not founded" });
};

export const getTopRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vendor.find({
    pinCode: pincode,
    serviceAvailable: false,
  })
    .sort([["rating", "descending"]])
    .limit(3);

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(400).json({ message: "This vendor not founded" });
};

export const getFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vendor.find({
    pinCode: pincode,
    serviceAvailable: false,
  })
    .populate("foods")
    .exec();

  if (result.length > 0) {
    let foodResult: any = [];
    result.map((vendor) => {
      const foods = vendor.foods as [FoodDoc];
      foodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });
    return res.status(200).json(foodResult);
  }
  return res.status(400).json({ message: "This vendor not founded" });
};

export const searchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;
  const result = await Vendor.find({
    pinCode: pincode,
    serviceAvailable: false,
  })
    .populate("foods")
    .exec();

  if (result.length > 0) {
    let foodResult: any = [];
    result.map((item) => foodResult.push(...item.foods));
    return res.status(200).json(foodResult);
  }
  return res.status(400).json({ message: "This vendor not founded" });
};
export const restaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const result = await Vendor.findById({ _id: id });
  if (result) {
    return res.status(200).json(result);
  }
  return res.status(400).json({ message: "This vendor not founded" });
};
