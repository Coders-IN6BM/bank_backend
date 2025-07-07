import {Schema, model} from 'mongoose';


const transactionSchema = new Schema({
    destunation: {
        type: Shema.Types.ObjectId,
        ref: 'User',
    },
    sender : {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    date : {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['success', 'completed', 'failed'],
        default: 'success'
    }
}, {
    timestamps: true,   
    versionKey: false
}); 

export default model('Transaction', transactionSchema);