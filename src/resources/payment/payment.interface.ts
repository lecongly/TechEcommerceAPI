import { Document } from 'mongoose';

export default interface Payment extends Document {
    user_id: string;
    name: string;
    email: string;
    address: string;
    cart: any;
    complete: boolean;
    send: boolean;
}
