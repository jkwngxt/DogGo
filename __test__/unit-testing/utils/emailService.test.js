import { EmailService } from '@/utils/emailService.js';
import fs from 'fs/promises';

describe('EmailService', () => {
    let emailService;

    beforeAll(() => {
        emailService = new EmailService();
    });

    it('should generate and save a welcome email', async () => {
        const id = 1;
        const email = 'test@example.com';
        const username = 'testUser';
        const password = 'testPassword123';

        jest.spyOn(fs, 'mkdir').mockResolvedValue();
        jest.spyOn(fs, 'writeFile').mockResolvedValue();

        const result = await emailService.sendWelcomeEmail(id, email, username, password);

        expect(result).toMatch(/\/dog-walkers\/welcome-emails\/1-testuser\.html/);
        expect(fs.mkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true });
        expect(fs.writeFile).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    });

    it('should handle errors when saving the email', async () => {
        const email = 'test@example.com';
        const username = 'testUser';
        const password = 'testPassword123';

        jest.spyOn(fs, 'mkdir').mockRejectedValue(new Error('Failed to create directory'));

        await expect(emailService.sendWelcomeEmail(email, username, password)).rejects.toThrow('Failed to create directory');
    });
});