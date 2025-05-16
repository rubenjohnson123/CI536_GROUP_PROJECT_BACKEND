import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ItemSchema = new Schema({
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: mongoose.Schema.Types.Decimal128, required: true },
    imageUrl: { type: String },
    location: { type: String, required: true },
    category: { type: String, required: true }
}, { 
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            if (ret.price != null && ret.price.toString) {
                ret.price = parseFloat(ret.price.toString());
            }
            return ret;
        }
    }
});

export default model('Item', ItemSchema);
