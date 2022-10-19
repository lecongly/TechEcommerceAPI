import { Document } from 'mongoose';

export default interface User extends Document {
    email: string;
    name: string;
    password: string;
    role: number;
    tokenVersion: number;
    avatar: string;
    state: boolean;
    cart?: Cart[] | null;
}

export interface Cart {
    checked: boolean;
    sold: number;
    stock: number;
    _id: string;
    available: boolean;
    product_id: string;
    name: string;
    images: Images;
    price: number;
    description: string;
    content: string;
    category: string;
    quantity: number;
}

export interface Images {
    public_id: string;
    url: string;
}
