import Product from '@/resources/product/product.interface';
import ProductModel from '@/resources/product/product.model';

class ProductService {
    private product = ProductModel;

    public async getProducts(): Promise<Product[]> {
        try {
            const products = await this.product.find();
            if (!products) {
                throw new Error(`No products on database`);
            }
            return products;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async createProduct(
        image: {
            public_id: string;
            url: string;
        },
        name: string,
        price: number,
        description: string,
        content: string,
        category: string,
        sold: number,
        stock: number,
        checked: boolean
    ): Promise<Product> {
        try {
            const product = await this.product.create({
                image,
                name,
                price,
                description,
                content,
                category,
                sold,
                stock,
                checked,
            });
            return product;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async getProductByID(id: string): Promise<Product> {
        try {
            const product = await this.product.findById(id);
            if (!product) {
                throw new Error(`Product with ID: ${id} not found.`);
            }
            return product;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async deleteProductByID(id: string): Promise<string> {
        try {
            const productToRemove = await this.product.findByIdAndRemove(id);
            if (!productToRemove) {
                throw new Error(`Product with ID: ${id} not found.`);
            }
            return `Product with ID: ${id} removed successfully.`;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async updateProductByID(id: string, state: any): Promise<string> {
        try {
            const productToUpdate = await this.product.findByIdAndUpdate(
                { _id: id },
                { ...state }
            );
            if (!productToUpdate) {
                throw new Error(`Product with ID: ${id} not found.`);
            }
            return `Product with ID: ${id} updated successfully.`;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default ProductService;
