import { Document } from 'mongoose';

export default interface Product extends Document {
    name: string;
    price: number;
    description: string;
    content: string;
    image: Image;
    category: string;
    checked: boolean;
    sold: number;
    stock: number;
}
interface Image {
    public_id: string;
    url: string;
}
