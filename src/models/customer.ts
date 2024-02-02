import mongoose, { Schema, Document, Model } from "mongoose";

interface CustomerDoc extends Document {
  email: string;
  password: string;
  phone: string;
  salt: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  address: string;
  otp: number;
  otp_expire: Date;
  lat: string;
  lng: string;
}

const CustomerSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    verified: { type: Boolean, required: true },
    address: { type: String },
    otp: { type: Number, required: true },
    otp_expire: { type: Date, required: true },
    lat: { type: Number },
    lng: { type: Number },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Customer = mongoose.model<CustomerDoc>("customer", CustomerSchema);

export { Customer };
