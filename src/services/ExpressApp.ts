import express, { Application } from "express";

import {
  AdminRoute,
  VendorRoute,
  ShoppingRoute,
  CustomerRoute,
  OrderRoute,
} from "../routes/index";

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/admin", AdminRoute);
  app.use("/vendor", VendorRoute);
  app.use("/shopping", ShoppingRoute);
  app.use("/user", CustomerRoute);
  app.use("/order", OrderRoute);

  return app;
};
