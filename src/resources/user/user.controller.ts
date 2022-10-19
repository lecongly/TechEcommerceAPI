import {
    authAdminMiddleware,
    authMiddleware,
} from '@/middleware/authenticated.middleware';
import validationMiddleware from '@/middleware/validation.middleware';
import UserService from '@/resources/user/user.service';
import validate from '@/resources/user/user.validation';
import HttpException from '@/utils/exceptions/http.exception';
import Controller from '@/utils/interfaces/controller.interface';
import { Cookies } from '@/utils/interfaces/token.interface';
import { NextFunction, Request, Response, Router } from 'express';

class UserController implements Controller {
    public path = `/users`;
    public router = Router();
    private UserService = new UserService();
    constructor() {
        this.initialiseRoutes();
    }
    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );
        this.router.post(`${this.path}/refresh`, this.refresh);
        this.router.post(
            `${this.path}/logout-all`,
            authMiddleware,
            this.logoutAll
        );
        this.router.post(
            `${this.path}/forgot`,
            validationMiddleware(validate.forgot),
            this.forgot
        );
        this.router.post(
            `${this.path}/reset`,
            authMiddleware,
            validationMiddleware(validate.resetPassword),
            this.resetPassword
        );
        this.router.get(`${this.path}/me`, authMiddleware, this.getUser);
        this.router.patch(
            `${this.path}/update`,
            authMiddleware,
            validationMiddleware(validate.update),
            this.update
        );
        this.router.patch(
            `${this.path}/add_cart`,
            authMiddleware,
            this.addToCart
        );
        this.router.patch(
            `${this.path}/wish_list`,
            authMiddleware,
            this.addToWishList
        );
        this.router.get(
            `${this.path}`,
            authMiddleware,
            authAdminMiddleware,
            this.getAllUser
        );
        this.router.get(
            `${this.path}/:id`,
            authMiddleware,
            authAdminMiddleware,
            this.getById
        );
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            authAdminMiddleware,
            this.deleteById
        );
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, email, password } = req.body;
            const { accessToken, refreshToken } =
                await this.UserService.register(name, email, password);
            res.json({ accessToken, refreshToken });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this.UserService.login(
                email,
                password
            );
            res.json({ accessToken, refreshToken });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private refresh = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const token = req.cookies[Cookies.RefreshToken];
            const { accessToken, refreshToken } =
                await this.UserService.refresh(token);
            res.json({ accessToken, refreshToken });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }

        res.end();
    };
    private logoutAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.UserService.increaseTokenVersion(
                res.locals.token.userId
            );
            res.json({ message: 'Increase TokenVersion' });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private forgot = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email } = req.body;
            const message = await this.UserService.forgot(email);
            res.json({ message });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private getUser = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const user = await this.UserService.getUserById(
                res.locals.token.userId
            );
            res.json(user);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private resetPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { password } = req.body;
            const message = await this.UserService.resetPassword(
                res.locals.token.userId,
                password
            );
            res.json({ message });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private update = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { name, avatar } = req.body;
            const message = await this.UserService.updateUser(
                res.locals.token.userId,
                name,
                avatar
            );
            res.json({ message });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private addToCart = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.UserService.getUserById(res.locals.token.userId);
            const { cart } = req.body;
            const message = await this.UserService.addToCartList(
                res.locals.token.userId,
                cart
            );
            res.json({ message });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private addToWishList = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.UserService.getUserById(res.locals.token.userId);
            const { wishList } = req.body;
            const message = await this.UserService.addToWishList(
                res.locals.token.userId,
                wishList
            );
            res.json({ message });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private getAllUser = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const users = await this.UserService.getAllUser();
            res.json(users);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private getById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const user = await this.UserService.getUserById(id);
            res.json(user);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private deleteById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const message = await this.UserService.deleteUserById(id);
            res.json({ message });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default UserController;
