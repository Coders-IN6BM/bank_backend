import { Schema, model } from "mongoose";

const accountSchema = Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    numAccount: {
        type: String,
        required: [true, "Requiere un numero de cuenta"],
        unique: true
    },
    typeAccount: {
        type: String,
        enum: ["AHORRO", "MONETARIA", "CREDITO"], 
        required: [true, "Requiere un tipo de cuenta"]
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

accountSchema.methods.toJSON = function () {
    const { _id, ...account } = this.toObject();
    account.uid = _id;
    return account;
};

export default model("Account", accountSchema);