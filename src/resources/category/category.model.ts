import Category from '@/resources/category/category.interface';
import { model, Schema } from 'mongoose';

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        image: {
            type: Object,
        },
    },
    { timestamps: true }
);
export default model<Category>('Category', CategorySchema);
