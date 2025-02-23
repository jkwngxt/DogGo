import { FileUploadService } from '@/utils/imageUpload.js';
import fs from 'fs/promises';

describe('ImageUploadService', () => {
    let fileUploadService;

    beforeAll(() => {
        fileUploadService = new FileUploadService();
    });

    it('should upload an image and return the path', async () => {
        const imageFile = {
            name: 'test.png',
            arrayBuffer: async () => new ArrayBuffer(8)
        };
        const id = '123';

        // จำลองการทำงานของ fs.mkdir และ fs.writeFile
        jest.spyOn(fs, 'mkdir').mockResolvedValue();
        jest.spyOn(fs, 'writeFile').mockResolvedValue();

        const result = await fileUploadService.uploadImage(imageFile, id);

        expect(result).toBe('/dog-walkers/images/123.png');
        expect(fs.mkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true });
        expect(fs.writeFile).toHaveBeenCalledWith(expect.any(String), expect.any(Buffer));
    });

    it('should handle errors when uploading the image', async () => {
        const imageFile = {
            name: 'test.png',
            arrayBuffer: async () => new ArrayBuffer(8)
        };
        const id = '123';

        // จำลองการเกิดข้อผิดพลาด
        jest.spyOn(fs, 'mkdir').mockRejectedValue(new Error('Failed to create directory'));

        await expect(fileUploadService.uploadImage(imageFile, id)).rejects.toThrow('Failed to create directory');
    });
});