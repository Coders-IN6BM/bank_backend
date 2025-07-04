import {Schema, model} from 'mongoose';
 
const movementSchema = Schema({
    id: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    typeMovement: {
        type: String,
        enum: ["DEPOSITO", "RETIRO", "TRANSFERENCIA"],
        required: [true, "Requiere un tipo de movimiento"]
    },
    amount: {
        type: Number,
        required: [true, "Requiere un monto"]
    },
    date: {
        type: Date,
        default: Date.now
    },
    originAccount: {
        type: String,
        default: ""
    },
    destinationAccount: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model("Movement", movementSchema);