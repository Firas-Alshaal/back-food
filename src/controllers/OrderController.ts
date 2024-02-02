import { Request, Response, NextFunction } from "express";
import { Customer } from "../models/customer";
import { OrderInput } from "../dto/Order.dto";
import { Food } from "../models/food";
import { Order } from "../models/order";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

    const profile = await Customer.findById({ _id: customer._id });

    const cart = <[OrderInput]>req.body;

    let cartItems = Array();

    let netAmount = 0.0;

    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    foods.map((food) => {
      cart.map(({ _id, unit }) => {
        if (food._id == _id) {
          netAmount += food.price * unit;
          cartItems.push({ food, unit });
        }
      });
    });

    if (cartItems) {
      const currentOrder = await Order.create({
        orderId: orderId,
        items: cartItems,
        totalAmount: netAmount,
        orderDate: new Date(),
        paidThrough: "COD",
        paymentResponse: "",
        orderStatus: "Waiting",
      });
      if (currentOrder) {
        profile.orders.push(currentOrder);
        const profileOrder = await profile.save();
        return res.status(200).json(profileOrder);
      }
    }
  }
  return res.status(400).json({ message: "Error with create order" });
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    return res.status(200).json({ message: "Yes" });
  }
  return res.status(400).json({ message: "Error with create order" });
};
