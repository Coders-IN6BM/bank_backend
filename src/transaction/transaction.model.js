import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
    idAccount: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model("Transaction", transactionSchema);