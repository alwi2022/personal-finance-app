import { Schema, model, Document } from "mongoose";

export interface OTPDocument extends Document {
  email: string;
  code: string;
  expiredAt: Date;
  lastSentAt: Date;
}

const OTPSchema = new Schema<OTPDocument>({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiredAt: { type: Date, required: true },
  lastSentAt: { type: Date, required: true },
});

export default model<OTPDocument>("OTP", OTPSchema);
