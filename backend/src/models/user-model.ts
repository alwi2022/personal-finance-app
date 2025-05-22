import mongoose, { Schema } from "mongoose";
import { User } from "../types/type";


const userSchema : Schema<User> = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
},
{ timestamps: true }
)



const UserModel = mongoose.model<User>("User", userSchema)

export default UserModel




