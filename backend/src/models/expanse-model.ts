import mongoose, { Schema } from "mongoose";
import { Expanse } from "../types/type";


const Expenseschema: Schema<Expanse> = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    source: { type: String, },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
}, {
    timestamps: true
})

const ExpanseModel = mongoose.model<Expanse>("Expanse", Expenseschema)

export default ExpanseModel



