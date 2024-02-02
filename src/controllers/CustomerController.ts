import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import {
  CreateCustomerInput,
  LoginCustomerInput,
  EditCustomerProfileInput,
} from "../dto/Customer.dto";
import { validate } from "class-validator";
import {
  GeneratePassword,
  GenerateSalt,
  ValidatePassword,
  generateSignature,
} from "../utility/passwordUtility";
import { Customer } from "../models/customer";
import { GenerateOTP, onRequestOTP } from "../utility/notificationUtility";

export const customerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInput = plainToClass(CreateCustomerInput, req.body);
  const inputErrors = await validate(customerInput);
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }
  const { email, password, phone } = customerInput;
  var salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = GenerateOTP();

  const existCustomer = await Customer.findOne({ email: email });

  if (existCustomer) {
    return res.status(409).json({ message: "That user already exist" });
  }
  const result = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expire: expiry,
    lastName: "",
    firstName: "",
    address: "",
    verified: false,
    lat: 0,
    lng: 0,
  });

  if (result) {
    await onRequestOTP(otp, phone);

    const signature = generateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });

    return res.status(201).json({
      signature: signature,
      email: result.email,
      verified: result.verified,
    });
  }

  return res.status(400).json({ message: "Error with signup" });
};

export const customerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInput = plainToClass(LoginCustomerInput, req.body);
  const inputErrors = await validate(customerInput);
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }
  const { email, password } = customerInput;

  const existCustomer = await Customer.findOne({ email: email });

  if (existCustomer) {
    const signature = generateSignature({
      _id: existCustomer._id,
      email: existCustomer.email,
      verified: existCustomer.verified,
    });

    const isPassword = await ValidatePassword(
      password,
      existCustomer.password,
      existCustomer.salt
    );

    if (isPassword) {
      return res.status(201).json({
        signature: signature,
      });
    } else {
      return res.status(400).json({ message: "Error with Password" });
    }
  }

  return res.status(404).json({ message: "That user don't exist" });
};

export const customerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById({ _id: customer._id });

    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expire >= new Date()) {
        profile.verified = true;

        const updateCustomerResponse = await profile.save();

        const signature = generateSignature({
          _id: updateCustomerResponse._id,
          email: updateCustomerResponse.email,
          verified: updateCustomerResponse.verified,
        });

        return res.status(201).json({
          signature: signature,
          email: updateCustomerResponse.email,
          verified: updateCustomerResponse.verified,
        });
      }
    }
  }
  return res.status(400).json({ message: "Error with OTP validation" });
};

export const customerRequestOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById({ _id: customer._id });
    if (profile) {
      const { otp, expiry } = GenerateOTP();
      profile.otp = otp;
      profile.otp_expire = expiry;
      await profile.save();

      await onRequestOTP(otp, profile.phone);

      return res.status(200).json({ message: "Otp has resend" });
    }
  }
  return res.status(400).json({ message: "Error with OTP validation" });
};

export const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById({ _id: customer._id });
    if (profile) {
      return res.status(200).json({ profile });
    }
  }
  return res.status(400).json({ message: "Error with get profile" });
};

export const editCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const customerInput = plainToClass(EditCustomerProfileInput, req.body);
  const inputErrors = await validate(customerInput);
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }
  const { firstName, lastName, address } = customerInput;

  if (customer) {
    const profile = await Customer.findById({ _id: customer._id });
    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;
      await profile.save();

      return res.status(200).json({ profile });
    }
  }
  return res.status(400).json({ message: "Error with edit profile" });
};
