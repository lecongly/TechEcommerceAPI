import HttpException from '@/utils/exceptions/http.exception';
import { Cookies } from '@/utils/interfaces/token.interface';
import { verifyAccessToken } from '@/utils/token';
import { NextFunction, Request, Response } from 'express';
import UserModel from '@/resources/user/user.model';

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = verifyAccessToken(req.cookies[Cookies.AccessToken]);

    if (!token) {
        return next(new HttpException(401, 'Unauthorized'));
    }

    res.locals.token = token;

    next();
}
export async function authAdminMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const id = res.locals.token.userId;
    const user = await UserModel.findOne({
        _id: id,
    });
    if (user) {
        if (user.role !== 1) {
            return next(
                new HttpException(403, "User doesn't have Admin role.")
            );
        }
    }
    next();
}
