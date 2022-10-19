import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import UserController from '@/resources/user/user.controller';
import ImageController from '@/resources/image/image.controller';
import CategoryController from '@/resources/category/category.controller';
import ProductController from '@/resources/product/product.controller';
import PaymentController from '@/resources/payment/payment.controller';
import { config } from '@/utils/config';

const app = new App(
    [
        new UserController(),
        new ImageController(),
        new CategoryController(),
        new ProductController(),
        new PaymentController(),
    ],
    Number(config.port)
);
app.listen();
