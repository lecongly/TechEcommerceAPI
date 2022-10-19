import validationMiddleware from '@/middleware/validation.middleware';
import ProductInterface from '@/resources/product/product.interface';
import ProductService from '@/resources/product/product.service';
import validate from '@/resources/product/product.validation';
import HttpException from '@/utils/exceptions/http.exception';
import Controller from '@/utils/interfaces/controller.interface';
import { NextFunction, Request, Response, Router } from 'express';

class ProductController implements Controller {
    public path = `/products`;
    public router = Router();
    private ProductService = new ProductService();
    constructor() {
        this.initialiseRoutes();
    }
    private initialiseRoutes(): void {
        this.router.get(`${this.path}`, this.getAll);
        this.router.post(
            `${this.path}`,
            validationMiddleware(validate.create),
            this.create
        );
        this.router.get(`${this.path}/:id`, this.getById);
        this.router.put(`${this.path}/:id`, this.updateById);
        this.router.delete(`${this.path}/:id`, this.deleteById);
    }
    private getAll = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const products = await this.ProductService.getProducts();
            res.status(200).json(products);
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
            const {
                image,
                name,
                price,
                description,
                content,
                category,
                sold,
                stock,
                checked,
            }: ProductInterface = req.body;
            const product = await this.ProductService.createProduct(
                image,
                name,
                price,
                description,
                content,
                category,
                sold,
                stock,
                checked
            );
            res.json({ product });
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
            const product = await this.ProductService.getProductByID(id);
            res.json(product);
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
            const message = await this.ProductService.deleteProductByID(id);
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
            const message = await this.ProductService.updateProductByID(
                id,
                state
            );
            res.json({ message });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}
export default ProductController;
