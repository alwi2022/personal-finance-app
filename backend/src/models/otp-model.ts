import { Schema, model, Document } from "mongoose";

export interface OTPDocument extends Document {
  email: string;
  code: string;
  expiredAt: Date;
  lastSentAt: Date;
  type: "register" | "reset_password";
}

const OTPSchema = new Schema<OTPDocument>({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiredAt: { type: Date, required: true },
  lastSentAt: { type: Date, required: true },
  type: {
    type: String,
    enum: ["register", "reset_password"],
    required: true,
    default: "register"
  },
});

OTPSchema.index({ email: 1, type: 1 });
OTPSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 }); // Auto delete expired OTP


export default model<OTPDocument>("OTP", OTPSchema);
