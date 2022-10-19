import {
    authAdminMiddleware,
    authMiddleware,
} from '@/middleware/authenticated.middleware';
import PaymentService from '@/resources/payment/payment.service';
import UserService from '@/resources/user/user.service';
import HttpException from '@/utils/exceptions/http.exception';
import Controller from '@/utils/interfaces/controller.interface';
import { NextFunction, Request, Response, Router } from 'express';

class PaymentController implements Controller {
    public path = `/payments`;
    public router = Router();
    private PaymentService = new PaymentService();
    private UserService = new UserService();

    constructor() {
        this.initialiseRoutes();
    }
    private initialiseRoutes(): void {
        this.router.get(
            `${this.path}`,
            authMiddleware,
            authAdminMiddleware,
            this.getAll
        );
        this.router.post(`${this.path}`, authMiddleware, this.create);
    }
    private getAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const payments = await this.PaymentService.getPayments();
            res.json(payments);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const user_id = res.locals.token.userId;
            const user = await this.UserService.getUserById(user_id);
            if (!user) {
                throw new Error('User not found');
            }
            const { cart, address } = req.body;
            const payment = await this.PaymentService.create(
                user_id,
                user.name,
                user.email,
                cart,
                address
            );
            res.json(payment);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}
export default PaymentController;
