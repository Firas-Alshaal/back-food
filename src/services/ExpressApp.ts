import express, { Application } from "express";
import bodyParser from "body-parser";
import path from "path";

import {
  AdminRoute,
  VendorRoute,
  ShoppingRoute,
  CustomerRoute,
} from "../routes/index";

export default async (app: Application) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/images", express.static(path.join(__dirname, "images")));

  app.use("/admin", AdminRoute);
  app.use("/vendor", VendorRoute);
  app.use("/shopping", ShoppingRoute);
  app.use("/shopping", ShoppingRoute);
  app.use("/user", CustomerRoute);

  return app;
};
