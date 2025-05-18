import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export function signToken(data: object): string {
  const token = jwt.sign(data, process.env.JWT_SECRET as string);
  return token;
}

export function verifyToken(token: string) {
  const data = jwt.verify(token, process.env.JWT_SECRET as string);
  console.info(data)
  return data;
}
