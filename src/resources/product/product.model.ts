import Product from '@/resources/product/product.interface';
import { model, Schema } from 'mongoose';

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        price: {
            type: Number,
            trim: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: Object,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        checked: {
            type: Boolean,
            default: false,
        },
        sold: {
            type: Number,
            default: 0,
        },
        stock: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);
ProductSchema.methods.toJSON = function () {
    const { ...data } = this.toObject();
    delete data.__v;
    return data;
};
export default model<Product>('Product', ProductSchema);
