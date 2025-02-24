import { generatePassword } from '@/utils/passwordGenerator.js';

describe('generatePassword', () => {
    it('should generate a password of the specified length', () => {
        const length = 12;
        const password = generatePassword(length);
        expect(password).toHaveLength(length);
    });

    it('should generate a password with characters from the charset', () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        const password = generatePassword();
        for (const char of password) {
            expect(charset).toContain(char);
        }
    });
});