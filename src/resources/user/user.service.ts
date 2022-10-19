import User from '@/resources/user/user.interface';
import UserModel from '@/resources/user/user.model';
import { config } from '@/utils/config';
import sendMail from '@/utils/sendMail';
import { buildTokens, refreshTokens, verifyRefreshToken } from '@/utils/token';
import bcrypt from 'bcrypt';

class UserService {
    private user = UserModel;
    public async getAllUser(): Promise<User[]> {
        try {
            const users = await this.user.find();
            return users;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async register(
        name: string,
        email: string,
        password: string
    ): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        try {
            const passwordHash = await bcrypt.hash(password, 10);
            const check = await this.user.findOne({ email });
            if (check) throw new Error('This email already exists');
            const user = await this.user.create({
                name,
                email,
                password: passwordHash,
            });
            return buildTokens(user);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async login(
        email: string,
        password: string
    ): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        try {
            const user = await this.user.findOne({ email });
            if (!user) {
                throw new Error('The email/password you entered is incorrect.');
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('The email/password you entered is incorrect.');
            }
            return buildTokens(user);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async refresh(token: string): Promise<{
        accessToken: string;
        refreshToken: string | undefined;
    }> {
        try {
            const current = verifyRefreshToken(token);
            const user = await this.user.findById(current.userId);
            if (!user) {
                throw new Error('User not found');
            }
            return refreshTokens(current, user.tokenVersion);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async getUserById(id: string): Promise<User> {
        try {
            const user = await this.user.findById(id).select('-password');
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async deleteUserById(id: string): Promise<string> {
        try {
            const user = await this.user.findByIdAndRemove(id);
            if (!user) {
                throw new Error('User not found');
            }
            return 'User removed successfully.';
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async increaseTokenVersion(userId: string): Promise<void | Error> {
        try {
            const user = await this.user.findOneAndUpdate(
                { _id: userId },
                { $inc: { tokenVersion: 1 } }
            );
            if (!user) {
                throw new Error('Unable to find user with that email address');
            }
        } catch (error) {
            throw new Error('Unable to increase TokenVersion');
        }
    }
    public async forgot(email: string): Promise<string | Error> {
        try {
            const user = await this.user.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }
            const { accessToken } = buildTokens(user);
            const url = `${config.clientUrl}/user/reset/${accessToken}`;
            sendMail(email, url, 'Reset your password');
            return 'Re-send the password, please check your email.';
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async resetPassword(
        id: string,
        password: string
    ): Promise<string | Error> {
        try {
            const passwordHash = await bcrypt.hash(password, 10);

            await this.user.findOneAndUpdate(
                { _id: id },
                {
                    password: passwordHash,
                }
            );
            return 'Password successfully changed!';
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async updateUser(
        id: string,
        name: string,
        avatar: string
    ): Promise<string | Error> {
        try {
            await this.user.findOneAndUpdate({ _id: id }, { name, avatar });
            return 'Update successfully!';
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async addToCartList(id: string, cart: any): Promise<string> {
        try {
            await this.user.findOneAndUpdate({ _id: id }, { cart });
            return 'Added to cart';
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async addToWishList(id: string, wishList: any): Promise<string> {
        try {
            await this.user.findOneAndUpdate({ _id: id }, { wishList });
            return 'Added items to wishList';
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default UserService;
