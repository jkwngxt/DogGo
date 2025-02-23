import fs from 'fs/promises';
import path from 'path';

export class FileUploadService {
    constructor() {
        this.uploadPath = path.join(process.cwd(), 'data', 'images', 'dog-walkers');
    }

    static setupStaticFiles(app) {
        const uploadPath = path.join(process.cwd(), 'data', 'images');
        app.use('/images', express.static(uploadPath));
    }

    async uploadImage(file, id) {
        try {
            await fs.mkdir(this.uploadPath, { recursive: true });

            const fileExt = path.extname(file.originalname);

            const fileName = `${id}${fileExt}`;
            const filePath = path.join(this.uploadPath, fileName);

            await fs.writeFile(filePath, file.buffer);

            return `/images/dog-walkers/${fileName}`;
        } catch (error) {
            console.error('File upload error:', error);
            throw error;
        }
    }
}
