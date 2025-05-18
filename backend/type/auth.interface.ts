import { z } from "zod";

import { User } from "./type";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  profileImageUrl?: string;
}


export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  fullName: string;
  email: string;
  profileImageUrl?: string;


}

export interface LoginResponse {
  access_token: string;
}

export const registerValidation = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
  profileImageUrl: z.string().optional(),
  
});

export const loginValidation = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});