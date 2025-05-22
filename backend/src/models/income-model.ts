import mongoose, { Schema } from "mongoose";
import { Income } from "../types/type";


const incomeSchema: Schema<Income> = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String, },
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
},{
    timestamps: true
})  


const IncomeModel = mongoose.model<Income>("Income", incomeSchema)

export default IncomeModel
