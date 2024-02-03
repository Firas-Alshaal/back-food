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

    let vendorId;

    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    foods.map((food) => {
      cart.map(({ _id, unit }) => {
        if (food._id == _id) {
          vendorId = food.vendorId;
          netAmount += food.price * unit;
          cartItems.push({ food, unit });
        }
      });
    });

    if (cartItems) {
      const currentOrder = await Order.create({
        orderId: orderId,
        vendorId: vendorId,
        items: cartItems,
        totalAmount: netAmount,
        orderDate: new Date(),
        paidThrough: "COD",
        paymentResponse: "",
        orderStatus: "Waiting",
        remarks: "",
        deliveryId: "",
        offerId: null,
        appliedOffers: false,
        readyTime: 45,
      });
      profile.cart = [] as any;
      profile.orders.push(currentOrder);
      const profileOrder = await profile.save();
      return res.status(200).json(profileOrder);
    }
  }
  return res.status(400).json({ message: "Error with create order" });
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById({ _id: customer._id }).populate(
      "orders"
    );

    if (profile) {
      return res.status(200).json(profile.orders);
    }
  }
  return res.status(400).json({ message: "Error with get orders" });
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const orderId = req.params.id;

  if (customer) {
    const profile = await Customer.findById({ _id: customer._id }).populate(
      "orders"
    );

    if (profile) {
      const order = await Order.findById({ _id: orderId }).populate(
        "items.food"
      );
      return res.status(200).json(order);
    }
  }
  return res.status(400).json({ message: "Error with get orders" });
};

export const getOrderProcess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const orderId = req.params.id;

  const { status, remarks, time } = req.body;

  if (customer) {
    if (orderId) {
      const order = await Order.findById({ _id: orderId }).populate("food");
      order.orderStatus = status;
      order.remarks = remarks;
      if (time) {
        order.readyTime = time;
      }

      const orderResult = await order.save();
      return res.status(200).json(orderResult);
    }
  }
  return res.status(400).json({ message: "Error with get orders" });
};

export const getCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const orders = await Order.find({ vendorId: user._id }).populate(
      "items.food"
    );

    if (orders) {
      return res.status(200).json(orders);
    }
  }
  return res.status(400).json({ message: "Error with get current orders" });
};
