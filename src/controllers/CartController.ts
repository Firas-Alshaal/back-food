import { Request, Response, NextFunction } from "express";
import { Customer } from "../models/customer";
import { OrderInput } from "../dto/Order.dto";
import { Food } from "../models/food";
import { Order } from "../models/order";

export const createCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById({ _id: customer._id }).populate(
      "cart.food"
    );

    let cartItems = Array();
    const { _id, unit } = <OrderInput>req.body;

    const food = await Food.findById({ _id: _id });

    if (food) {
      if (profile) {
        cartItems = profile.cart;

        if (cartItems.length > 0) {
          let existingFoodItem = cartItems.filter(
            (item) => item.food._id.toString() === _id
          );

          if (existingFoodItem.length > 0) {
            const index = cartItems.indexOf(existingFoodItem[0]);
            if (unit > 0) {
              cartItems[index] = { food, unit };
            } else {
              cartItems.splice(index, 1);
            }
          } else {
            cartItems.push({ food, unit });
          }
        } else {
          cartItems.push({ food, unit });
        }
        if (cartItems) {
          profile.cart = cartItems as any;
          const cartResult = await profile.save();
          return res.status(201).json(cartResult.cart);
        }
      }
    }
  }
  return res.status(400).json({ message: "Error with create order" });
};

export const getCarts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById({ _id: customer._id }).populate(
      "cart.food"
    );

    if (profile) {
      return res.status(200).json(profile.cart);
    }
  }
  return res.status(400).json({ message: "Error with get carts" });
};

export const deleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById({ _id: customer._id }).populate(
      "cart.food"
    );

    if (profile) {
      profile.cart = [] as any;
      const cartResult = await profile.save();
      return res.status(200).json(cartResult);
    }
  }
  return res.status(400).json({ message: "Error with delete carts" });
};
