import express, { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto/Vendor.dto";
import { Vendor } from "../models/vendor";
import { GeneratePassword, GenerateSalt } from "../utility/passwordUtility";

export const findVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email: email });
  } else {
    return await Vendor.findById({ _id: id });
  }
};

export const createVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pinCode,
    foodType,
    password,
    email,
    ownerName,
    phone,
  } = <CreateVendorInput>req.body;

  const existingVendor = await findVendor("", email);

  if (existingVendor !== null) {
    return res.json({ message: "A vendor is exist in database" });
  }

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const createVendor = await Vendor.create({
    name: name,
    address: address,
    pinCode: pinCode,
    foodType: foodType,
    password: userPassword,
    email: email,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    foods: [],
  });

  return res.json(createVendor);
};

export const getVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find();

  if (vendors !== null) {
    return res.json(vendors);
  }

  return res.json({ message: "Not found" });
};

export const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendorId = req.params.id;
  const vendors = await findVendor(vendorId);

  if (vendors !== null) {
    return res.json(vendors);
  }

  return res.json({ message: "Not found" });
};
