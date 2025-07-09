import { NextFunction, Request, Response } from "express";

import User from "../models/user-model";
import { verifyToken } from "../utils/jwt.util";

export async function authentication(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      throw { name: "Unauthorized", message: "Invalid token" };
    }

    const [_, token] = bearerToken.split(" ");
    if (!token) {
      throw { name: "Unauthorized", message: "Invalid token" };
    }

    const data = verifyToken(token) as { id: string };
    const user = await User.findById(data.id);

    if (!user) {
      throw { name: "Unauthorized", message: "Invalid token" };
    }

    type RequestWithUser = Request & { user: typeof user };
    (req as RequestWithUser).user = user;
    next();
  } catch (err) {
    next(err);
  }
}
