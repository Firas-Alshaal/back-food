import express, { Request, Response, NextFunction } from "express";
import { EditVendorInput, VendorLoginInput } from "../dto/Vendor.dto";
import { findVendor } from "./AdminController";
import {
  ValidatePassword,
  generateSignature,
} from "../utility/passwordUtility";
import { CreateFoodInput } from "../dto/Food.dto";
import { Food } from "../models/food";

export const vendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password, email } = <VendorLoginInput>req.body;

  const existingVendor = await findVendor("", email);

  if (existingVendor) {
    const validation = await ValidatePassword(
      password,
      existingVendor.password,
      existingVendor.salt
    );

    if (validation) {
      const signature = generateSignature({
        _id: existingVendor._id,
        email: existingVendor.email,
        name: existingVendor.name,
        foodType: existingVendor.foodType,
      });
      return res.json(signature);
    } else {
      return res.json({ message: "password not valid" });
    }
  }

  return res.json({ message: "Login credential not valid" });
};

export const getVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await findVendor(user._id);
    return res.json(existingVendor);
  }
  return res.json({ message: "Vendor information not found" });
};

export const updateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, foodType, address, phone } = <EditVendorInput>req.body;
  const user = req.user;
  if (user) {
    const existingVendor = await findVendor(user._id);

    if (existingVendor) {
      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.foodType = foodType;
      existingVendor.phone = phone;

      const saveResult = await existingVendor.save();
      return res.json(saveResult);
    }

    return res.json({ message: "vendor not exist" });
  }
  return res.json({ message: "user not authorized" });
};

export const updateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await findVendor(user._id);

    if (existingVendor) {
      existingVendor.serviceAvailable = req.body.serviceAvailable;

      const saveResult = await existingVendor.save();
      return res.json(saveResult);
    }

    return res.json({ message: "vendor not exist" });
  }
  return res.json({ message: "user not authorized" });
};

export const addVendorFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const { name, description, category, foodType, readyTime, price } = <
      CreateFoodInput
    >req.body;

    const vendor = await findVendor(user._id);
    if (vendor) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      const createFood = await Food.create({
        vendorId: vendor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        readyTime: readyTime,
        price: price,
        images: images,
        rating: 0,
      });

      vendor.foods.push(createFood);

      const result = await vendor.save();

      return res.json(result);
    }

    return res.json({ message: "vendor not exist" });
  }
  return res.json({ message: "user not authorized" });
};

export const getVendorFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const foods = await Food.find({ vendorId: user._id });

    if (foods) {
      return res.json(foods);
    }
  }
  return res.json({ message: "Vendor information not found" });
};

export const updateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const vendor = await findVendor(user._id);
    if (vendor) {
      const files = req.files as [Express.Multer.File];

      const images = files.map((file: Express.Multer.File) => file.filename);

      vendor.coverImages.push(...images);

      const result = await vendor.save();

      return res.json(result);
    }

    return res.json({ message: "vendor not exist" });
  }
  return res.json({ message: "user not authorized" });
};
