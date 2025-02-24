import fs from 'fs/promises';
import path from 'path';

export class FileUploadService {
    async uploadImage(imageFile, id) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const originalExtension = imageFile.name.split('.').pop().toLowerCase();
        const fileName = `${id}.${originalExtension}`;

        const imagePath = `/dog-walkers/images/${fileName}`;

        const fullPath = path.join(process.cwd(), 'data', 'dog-walkers', 'images', fileName);

        try {
            await fs.mkdir(path.dirname(fullPath), { recursive: true });

            await fs.writeFile(fullPath, buffer);

            return imagePath;
        } catch (error) {
            throw error;
        }
    }
}
