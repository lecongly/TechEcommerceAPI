import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import { File } from '@/utils/interfaces/file.interface';
import { removeTmpFiles } from '@/utils/cloudinary';
import ImageService from '@/resources/image/image.service';

class ImageController implements Controller {
    public path = `/image`;
    public router = Router();
    private ImageService = new ImageService();
    constructor() {
        this.initialiseRoutes();
    }
    private initialiseRoutes(): void {
        this.router.post(`${this.path}/upload`, this.upload);
        this.router.post(`${this.path}/remove`, this.remove);
    }
    private upload = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { file }: any = req.files;
            const { tempFilePath, size, mimetype }: File = file;
            if (!req.files || Object.keys(req.files).length === 0) {
                throw new Error('No images selected.');
            }
            if (size > 1024 * 1024) {
                removeTmpFiles(tempFilePath);
                throw new Error('Image size is too large.');
            }
            if (
                mimetype !== 'image/jpeg' &&
                mimetype !== 'image/webp' &&
                mimetype !== 'image/png'
            ) {
                removeTmpFiles(tempFilePath);
                throw new Error('Incorrect image format');
            }
            const data = await this.ImageService.upload(tempFilePath);
            res.json(data);
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private remove = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { public_id } = req.body;
            if (!public_id) {
                next(new HttpException(400, 'No image public Id selected.'));
            }
            const data = await this.ImageService.remove(public_id);
            if (data.result == 'not found') {
                next(new HttpException(400, 'No found public id selected.'));
            } else {
                res.json({ message: 'Delete successfully' });
            }
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}
export default ImageController;
