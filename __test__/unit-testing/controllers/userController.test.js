import bcrypt from 'bcryptjs';
import { UserController } from '@/controllers/userController';

jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn()
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn()
}));

describe('UserController', () => {
    let userController;
    let mockPrismaClient;
    let mockTransaction;

    beforeEach(() => {
        jest.clearAllMocks();

        // Create mock transaction
        mockTransaction = {
            user: {
                findFirst: jest.fn(),
                create: jest.fn()
            }
        };

        // Create mock Prisma client with transaction support
        mockPrismaClient = {
            user: {
                findFirst: jest.fn(),
                create: jest.fn()
            },
            $transaction: jest.fn(callback => callback(mockTransaction))
        };

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
            zone: 'Test Zone',
            dogs: [
                { name: 'Buddy', breed: 'Golden Retriever' },
                { name: 'Max', breed: 'Labrador' }
            ]
        };

        const mockHashedPassword = 'hashedPassword123';

        it('should successfully register a new user with dogs', async () => {
            mockTransaction.user.findFirst
                .mockImplementationOnce(() => Promise.resolve(null))
                .mockImplementationOnce(() => Promise.resolve(null));

            bcrypt.hash.mockImplementation(() => Promise.resolve(mockHashedPassword));

            const mockCreatedUser = {
                id: 1,
                ...mockUserData,
                password: mockHashedPassword,
                dogs: mockUserData.dogs.map((dog, index) => ({
                    id: index + 1,
                    ...dog,
                    ownerId: 1
                }))
            };

            mockTransaction.user.create.mockImplementation(() => Promise.resolve(mockCreatedUser));

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
                zone: mockUserData.zone,
                dogs: mockCreatedUser.dogs
            });
            expect(result.user.password).toBeUndefined();
        });

        it('should handle registration with no dogs', async () => {
            const userDataWithoutDogs = { ...mockUserData };
            delete userDataWithoutDogs.dogs;

            mockTransaction.user.findFirst
                .mockImplementationOnce(() => Promise.resolve(null))
                .mockImplementationOnce(() => Promise.resolve(null));

            bcrypt.hash.mockImplementation(() => Promise.resolve(mockHashedPassword));

            mockTransaction.user.create.mockImplementation(() => Promise.resolve({
                id: 1,
                ...userDataWithoutDogs,
                password: mockHashedPassword,
                dogs: []
            }));

            const result = await userController.register(userDataWithoutDogs);

            expect(result.success).toBe(true);
            expect(result.user.dogs).toEqual([]);
        });

        it('should fail if username already exists', async () => {
            mockTransaction.user.findFirst.mockImplementation(() => Promise.resolve({
                id: 1,
                ...mockUserData
            }));

            const result = await userController.register(mockUserData);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Username already exists');
            expect(mockTransaction.user.create).not.toHaveBeenCalled();
        });

        it('should fail if email already exists', async () => {
            mockTransaction.user.findFirst
                .mockImplementationOnce(() => Promise.resolve(null))
                .mockImplementationOnce(() => Promise.resolve({
                    id: 1,
                    ...mockUserData
                }));

            const result = await userController.register(mockUserData);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Email already exists');
            expect(mockTransaction.user.create).not.toHaveBeenCalled();
        });

        it('should handle internal server errors', async () => {
            mockTransaction.user.findFirst.mockImplementation(() => Promise.reject(new Error('Database error')));

            const result = await userController.register(mockUserData);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Internal server error');
            expect(mockTransaction.user.create).not.toHaveBeenCalled();
        });

        it('should hash the password before saving', async () => {
            mockTransaction.user.findFirst
                .mockImplementationOnce(() => Promise.resolve(null))
                .mockImplementationOnce(() => Promise.resolve(null));

            bcrypt.hash.mockImplementation(() => Promise.resolve(mockHashedPassword));

            mockTransaction.user.create.mockImplementation(() => Promise.resolve({
                id: 1,
                ...mockUserData,
                password: mockHashedPassword,
                dogs: []
            }));

            await userController.register(mockUserData);

            expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
            expect(mockTransaction.user.create).toHaveBeenCalledWith({
                data: {
                    ...mockUserData,
                    password: mockHashedPassword,
                    dogs: {
                        create: mockUserData.dogs
                    }
                },
                include: {
                    dogs: true
                }
            });
        });
    });
});