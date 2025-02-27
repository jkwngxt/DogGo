import { DogWalkerRegisterController } from '@/controllers/DogWalkerRegisterController.js';
import { PrismaClient } from '@prisma/client';
import { FileUploadService } from '@/utils/fileUpload.js';
import {EmailService} from "@/utils/email/emailService";

// จำลอง Prisma Client
jest.mock('@prisma/client', () => {
    return {
        PrismaClient: jest.fn(() => ({
            dogWalker: {
                findUnique: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
            $transaction: jest.fn((callback) => callback({
                dogWalker: {
                    findUnique: jest.fn(),
                    create: jest.fn(),
                    update: jest.fn(),
                    delete: jest.fn(),
                }
            })),
        })),
    };
});

jest.mock('@/utils/email/emailService.js', () => ({
    EmailService: jest.fn(() => ({
        sendWelcomeEmail: jest.fn(),
    })),
}));

jest.mock('@/utils/fileUpload.js', () => ({
    FileUploadService: jest.fn(() => ({
        uploadImage: jest.fn(),
    })),
}));

describe('DogWalkerController', () => {
    let dogWalkerController;
    let prisma;
    let emailService;
    let fileUploadService;

    beforeAll(() => {
        prisma = new PrismaClient();
        emailService = new EmailService();
        fileUploadService = new FileUploadService();
        dogWalkerController = new DogWalkerRegisterController(prisma, emailService, fileUploadService); // ส่ง mock objects เข้าไป
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register a new dog walker successfully', async () => {
        const dogWalkerData = {
            name: 'John Doe',
            username: 'johndoe',
            email: 'johndoe@example.com',
        };
        const imageFile = { name: 'test.png' };

        prisma.$transaction.mockImplementation(async (callback) => {
            return callback({
                dogWalker: {
                    findUnique: jest.fn()
                        .mockResolvedValueOnce(null) // ไม่พบชื่อผู้ใช้ซ้ำ
                        .mockResolvedValueOnce(null), // ไม่พบอีเมลซ้ำ
                    create: jest.fn().mockResolvedValue({
                        id: 1,
                        ...dogWalkerData,
                        password: 'hashedPassword',
                        pic: '',
                    }),
                    update: jest.fn().mockResolvedValue({
                        id: 1,
                        ...dogWalkerData,
                        pic: '/dog-walkers/images/1.png',
                    }),
                    delete: jest.fn().mockResolvedValue({}),
                },
            });
        });

        fileUploadService.uploadImage.mockResolvedValue('/dog-walkers/images/1.png');
        emailService.sendWelcomeEmail.mockResolvedValue(true);

        const result = await dogWalkerController.register(dogWalkerData, imageFile);

        expect(result.success).toBe(true); // คาดหวังว่า success เป็น true
        expect(result.message).toBe('Dog walker registered successfully and welcome email sent');
        expect(result.dogWalker).toHaveProperty('id', 1);
        expect(result.dogWalker).not.toHaveProperty('password');
    });


    it('should return an error if username already exists', async () => {
        const dogWalkerData = {
            name: 'John Doe',
            username: 'johndoe',
            email: 'johndoe@example.com',
        };

        prisma.$transaction.mockImplementation(async (callback) => {
            return callback({
                dogWalker: {
                    findUnique: jest.fn().mockResolvedValue({ id: 1 }), // พบชื่อผู้ใช้ซ้ำ
                },
            });
        });

        const result = await dogWalkerController.register(dogWalkerData, null);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Username already exists');
    });

    it('should return an error if email already exists', async () => {
        const dogWalkerData = {
            name: 'John Doe',
            username: 'johndoe',
            email: 'johndoe@example.com',
        };

        prisma.$transaction.mockImplementation(async (callback) => {
            return callback({
                dogWalker: {
                    findUnique: jest.fn()
                        .mockResolvedValueOnce(null) // ไม่พบชื่อผู้ใช้ซ้ำ
                        .mockResolvedValue({ id: 1 }), // พบอีเมลซ้ำ
                },
            });
        });

        const result = await dogWalkerController.register(dogWalkerData, null);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Email already exists');
    });

    it('should return an error if image upload fails', async () => {
        const dogWalkerData = {
            name: 'John Doe',
            username: 'johndoe',
            email: 'johndoe@example.com',
        };
        const imageFile = { name: 'test.png' };

        // จำลองการทำงานของ Prisma
        prisma.$transaction.mockImplementation(async (callback) => {
            return callback({
                dogWalker: {
                    findUnique: jest.fn()
                        .mockResolvedValueOnce(null) // ไม่พบชื่อผู้ใช้ซ้ำ
                        .mockResolvedValueOnce(null), // ไม่พบอีเมลซ้ำ
                    create: jest.fn().mockResolvedValue({
                        id: 1,
                        ...dogWalkerData,
                        password: 'hashedPassword',
                        pic: '',
                    }),
                    delete: jest.fn().mockResolvedValue({}),
                },
            });
        });

        fileUploadService.uploadImage.mockRejectedValue(new Error('Image upload failed'));

        const result = await dogWalkerController.register(dogWalkerData, imageFile);

        expect(result.success).toBe(false);
        expect(result.message).toMatch('Image upload failed');
    });

    it('should return an error if email sending fails', async () => {
        const dogWalkerData = {
            name: 'John Doe',
            username: 'johndoe',
            email: 'johndoe@example.com',
        };
        const imageFile = { name: 'test.png' };

        prisma.$transaction.mockImplementation(async (callback) => {
            return callback({
                dogWalker: {
                    findUnique: jest.fn()
                        .mockResolvedValueOnce(null) // ไม่พบชื่อผู้ใช้ซ้ำ
                        .mockResolvedValueOnce(null), // ไม่พบอีเมลซ้ำ
                    create: jest.fn().mockResolvedValue({
                        id: 1,
                        ...dogWalkerData,
                        password: 'hashedPassword',
                        pic: '',
                    }),
                    update: jest.fn().mockResolvedValue({
                        id: 1,
                        ...dogWalkerData,
                        pic: '/dog-walkers/images/1.png',
                    }),
                    delete: jest.fn().mockResolvedValue({}),
                },
            });
        });

        fileUploadService.uploadImage.mockResolvedValue('/dog-walkers/images/1.png');

        emailService.sendWelcomeEmail.mockResolvedValue(false);

        const result = await dogWalkerController.register(dogWalkerData, imageFile);

        expect(result.success).toBe(false);
        expect(result.message).toBe('Dog walker registered, but email sending failed. Registration has been rolled back.');
    });
});