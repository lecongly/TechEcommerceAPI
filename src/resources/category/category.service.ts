import CategoryModel from '@/resources/category/category.model';
import Category from '@/resources/category/category.interface';

class CategoryService {
    private category = CategoryModel;

    public async getCategories(): Promise<Category[]> {
        try {
            const categories = await this.category.find();
            if (!categories) {
                throw new Error(`No categories on database`);
            }
            return categories;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async createCategory(name: string): Promise<Category> {
        try {
            const category = await this.category.create({ name });
            return category;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async getCategoryByID(id: string): Promise<Category> {
        try {
            const category = await this.category.findById(id);
            if (!category) {
                throw new Error(`Category with ID: ${id} not found.`);
            }
            return category;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async deleteCategoryByID(id: string): Promise<string> {
        try {
            const categoryToRemove = await this.category.findByIdAndRemove(id);
            if (!categoryToRemove) {
                throw new Error(`Category with ID: ${id} not found.`);
            }
            return `Category with ID: ${id} removed successfully.`;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    public async updateCategoryByID(id: string, state: any): Promise<string> {
        try {
            const categoryToUpdate = await this.category.findByIdAndUpdate(
                { _id: id },
                { ...state }
            );
            if (!categoryToUpdate) {
                throw new Error(`Category with ID: ${id} not found.`);
            }
            return `Category with ID: ${id} updated successfully.`;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default CategoryService;
