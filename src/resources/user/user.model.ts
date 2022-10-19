import User from '@/resources/user/user.interface';
import { model, Schema } from 'mongoose';

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
        },
        role: {
            type: Number,
            required: true,
            default: 0,
        },
        tokenVersion: {
            type: Number,
            required: true,
            default: 0,
        },
        avatar: {
            type: String,
            default:
                'https://res.cloudinary.com/congly2810/image/upload/v1664118040/avatar/tutcbepph8ezeb0aym1q.png',
        },
        state: {
            type: Boolean,
            default: true,
        },
        cart: {
            type: Array,
            default: [],
        },
        wishList: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);
UserSchema.methods.toJSON = function () {
    const {...user} = this.toObject();
    delete user.__v;
    delete user.password;
    return user;
};

export default model<User>('User', UserSchema);
