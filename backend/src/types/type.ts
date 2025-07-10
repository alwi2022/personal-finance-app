import { Types } from "mongoose";
import { Document } from "mongoose";


export interface User extends Document {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    password: string;
    profileImageUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface RegisterRequestBody {
    fullName: string;
    email: string;
    password: string;
    profileImageUrl?: string;
  }
  

  export interface Income extends Document {
    userId: Types.ObjectId;
    icon: string;
    category: string;
    source: string;
    amount: number;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  export interface Expanse extends Document {
    userId: Types.ObjectId;
    source: string;
    category: string;
    amount: number;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
  }



  