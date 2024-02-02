import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { VendorPayload } from "../dto/Vendor.dto";
import { APP_SECRET } from "../config";
import { AuthPayload } from "../dto/Auth.dto";

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const generateSignature = (payload: AuthPayload) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};

export const validateSignature = async (req: Request) => {
  const signature = req.get("Authorization");
  if (signature) {
    const payload = jwt.verify(
      signature.split(" ")[1],
      APP_SECRET
    ) as AuthPayload;

    req.user = payload;
    return true;
  }
  return false;
};
