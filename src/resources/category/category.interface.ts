import { Document } from 'mongoose';

export default interface Category extends Document {
    name: string;
    images: Image;
}
interface Image {
    public_id: string;
    url: string;
}
