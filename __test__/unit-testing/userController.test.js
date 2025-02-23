import bcrypt from 'bcryptjs';
import {UserController} from '@/controllers/UserController';

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn()
}));

// Mock bcrypt
jest.mock('bcryptjs', () => ({
    hash: jest.fn()
}));

describe('UserController', () => {
    let userController;
    let mockPrismaClient;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Create mock Prisma client
        mockPrismaClient = {
            user: {
                findFirst: jest.fn(),
                create: jest.fn()
            }
        };

        // Initialize controller with mock client
        userController = new UserController(mockPrismaClient);
    });

    describe('register', () => {
        const mockUserData = {
            name: 'Test User',
            username: 'testuser',
            password: 'password123',
            email: 'test@example.com',
            tel: '1234567890',
            address: '123 Test St',
            zone: 'Test Zone'
        };

        const mockHashedPassword = 'hashedPassword123';

        it('should successfully register a new user', async () => {
            // Mock implementations
            mockPrismaClient.user.findFirst
                .mockImplementationOnce(() => Promise.resolve(null))  // username check
                .mockImplementationOnce(() => Promise.resolve(null)); // email check

            bcrypt.hash.mockImplementation(() => Promise.resolve(mockHashedPassword));

            mockPrismaClient.user.create.mockImplementation(() => Promise.resolve({
                id: 1,
                ...mockUserData,
                password: mockHashedPassword
            }));

            const result = await userController.register(mockUserData);

            expect(result.success).toBe(true);
            expect(result.message).toBe('User registered successfully');
            expect(result.user).toEqual({
                id: 1,
                name: mockUserData.name,
                username: mockUserData.username,
                email: mockUserData.email,
                tel: mockUserData.tel,
                address: mockUserData.address,
                zone: mockUserData.zone
            });
            expect(result.user.password).toBeUndefined();
        });

        it('should fail if username already exists', async () => {
            mockPrismaClient.user.findFirst.mockImplementation(() => Promise.resolve({
                id: 1,
                ...mockUserData
            }));

            const result = await userController.register(mockUserData);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Username already exists');
            expect(mockPrismaClient.user.create).not.toHaveBeenCalled();
        });

        it('should fail if email already exists', async () => {
            mockPrismaClient.user.findFirst
                .mockImplementationOnce(() => Promise.resolve(null))
                .mockImplementationOnce(() => Promise.resolve({
                    id: 1,
                    ...mockUserData
                }));

            const result = await userController.register(mockUserData);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Email already exists');
            expect(mockPrismaClient.user.create).not.toHaveBeenCalled();
        });

        it('should handle internal server errors', async () => {
            mockPrismaClient.user.findFirst.mockImplementation(() => Promise.reject(new Error('Database error')));

            const result = await userController.register(mockUserData);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Internal server error');
            expect(mockPrismaClient.user.create).not.toHaveBeenCalled();
        });

        it('should hash the password before saving', async () => {
            mockPrismaClient.user.findFirst
                .mockImplementationOnce(() => Promise.resolve(null))
                .mockImplementationOnce(() => Promise.resolve(null));

            bcrypt.hash.mockImplementation(() => Promise.resolve(mockHashedPassword));

            mockPrismaClient.user.create.mockImplementation(() => Promise.resolve({
                id: 1,
                ...mockUserData,
                password: mockHashedPassword
            }));

            await userController.register(mockUserData);

            expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
            expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
                data: {
                    ...mockUserData,
                    password: mockHashedPassword
                }
            });
        });
    });
});