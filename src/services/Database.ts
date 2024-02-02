import mongoose from "mongoose";
import { MONGO_URL } from "../config";

export default async () => {
  try {
    await mongoose.connect(MONGO_URL).then((result) => {
      console.log("DB connected");
    });
  } catch (err) {
    console.log("error" + err);
  }
};
