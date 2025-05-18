import UserModel from "../model/user-model";
import { comparePassword, hashPassword } from "../utils/bcrypt.util";
import { signToken } from "../utils/jwt.util";
import { Request, Response, RequestHandler } from "express";

export default class AuthController {
  static Register: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fullName, email, password, profileImageUrl } = req.body;

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "Email already exists" });
        return;
      }

      const user = await UserModel.create({
        fullName,
        email,
        password: hashPassword(password),
        profileImageUrl,
      });

      res.status(201).json({
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        access_token: signToken({ id: user._id }),
      });
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
      return
    }
  };

  static Login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user || !comparePassword(password, user.password)) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      const access_token = signToken({ id: user._id });
      res.status(200).json({
        id: user._id,
        user,
        access_token
      });

    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
      return
    }
  };

  static GetUserInfo: RequestHandler = async (req: Request, res: Response) => {
    try {
      // Assuming req.user is set by authentication middleware
      const userId = (req as any).user?._id;
      const user = await UserModel.findById(userId).select("-password")
      if (!user) {
        res.status(404).json({ message: "User not found" })
        return
      }
      res.status(200).json({ user })
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" })
      return
    }
  };
}
