import {
    authAdminMiddleware,
    authMiddleware,
} from '@/middleware/authenticated.middleware';
import validationMiddleware from '@/middleware/validation.middleware';
import CategoryService from '@/resources/category/category.service';
import validate from '@/resources/category/category.validation';
import HttpException from '@/utils/exceptions/http.exception';
import Controller from '@/utils/interfaces/controller.interface';
import { NextFunction, Request, Response, Router } from 'express';

class CategoryController implements Controller {
    public path = `/categories`;
    public router = Router();
    private CategoryService = new CategoryService();
    constructor() {
        this.initialiseRoutes();
    }
    private initialiseRoutes(): void {
        this.router.get(`${this.path}`, this.getAll);
        this.router.post(
            `${this.path}`,
            authMiddleware,
            authAdminMiddleware,
            validationMiddleware(validate.create),
            this.create
        );
        this.router.get(`${this.path}/:id`, this.getById);
        this.router.put(
            `${this.path}/:id`,
            authMiddleware,
            authAdminMiddleware,
            this.updateById
        );
        this.router.delete(
            `${this.path}/:id`,
            authMiddleware,
            authAdminMiddleware,
            this.deleteById
        );
    }
    private getAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const categories = await this.CategoryService.getCategories();
            res.status(200).json(categories);
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
            const { name } = req.body;
            const category = await this.CategoryService.createCategory(name);
            res.status(201).json(category);
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
            const category = await this.CategoryService.getCategoryByID(id);
            res.json(category);
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
            const message = await this.CategoryService.deleteCategoryByID(id);
            res.json({ message });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private updateById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const state = req.body;
            const message = await this.CategoryService.updateCategoryByID(
                id,
                state
            );
            res.json({ message });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}
export default CategoryController;
