import { POST } from '@/app/api/user/register/route';
import { UserRegisterController } from '@/controllers/UserRegisterController';

jest.mock('@/controllers/UserRegisterController', () => ({
    UserController: jest.fn()
}));

jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data, options) => ({
            data,
            status: options?.status
        }))
    }
}));

describe('POST /api/user/register', () => {
    let mockRegister;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRegister = jest.fn();
        UserRegisterController.mockImplementation(() => ({
            register: mockRegister
        }));
    });

    const mockRequestBody = {
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

    it('should successfully register a new user', async () => {
        const mockSuccessResponse = {
            success: true,
            message: 'User registered successfully',
            user: {
                id: 1,
                ...mockRequestBody,
                password: undefined,
                dogs: [
                    { id: 1, name: 'Buddy', breed: 'Golden Retriever', ownerId: 1 },
                    { id: 2, name: 'Max', breed: 'Labrador', ownerId: 1 }
                ]
            }
        };

        mockRegister.mockResolvedValue(mockSuccessResponse);

        const request = new Request('http://localhost:3000/api/user/register', {
            method: 'POST',
            body: JSON.stringify(mockRequestBody)
        });

        const response = await POST(request);

        expect(response.status).toBe(201);
        expect(response.data).toEqual(mockSuccessResponse);
        expect(mockRegister).toHaveBeenCalledWith(mockRequestBody);
    });

    it('should return 409 when username already exists', async () => {
        const mockConflictResponse = {
            success: false,
            message: 'Username already exists'
        };

        mockRegister.mockResolvedValue(mockConflictResponse);

        const request = new Request('http://localhost:3000/api/user/register', {
            method: 'POST',
            body: JSON.stringify(mockRequestBody)
        });

        const response = await POST(request);

        expect(response.status).toBe(409);
        expect(response.data).toEqual(mockConflictResponse);
    });

    it('should return 409 when email already exists', async () => {
        const mockConflictResponse = {
            success: false,
            message: 'Email already exists'
        };

        mockRegister.mockResolvedValue(mockConflictResponse);

        const request = new Request('http://localhost:3000/api/user/register', {
            method: 'POST',
            body: JSON.stringify(mockRequestBody)
        });

        const response = await POST(request);

        expect(response.status).toBe(409);
        expect(response.data).toEqual(mockConflictResponse);
    });

    it('should return 500 on controller error', async () => {
        const mockErrorResponse = {
            success: false,
            message: 'Internal server error'
        };

        mockRegister.mockResolvedValue(mockErrorResponse);

        const request = new Request('http://localhost:3000/api/user/register', {
            method: 'POST',
            body: JSON.stringify(mockRequestBody)
        });

        const response = await POST(request);

        expect(response.status).toBe(500);
        expect(response.data).toEqual(mockErrorResponse);
    });

    it('should return 500 on JSON parse error', async () => {
        const request = new Request('http://localhost:3000/api/user/register', {
            method: 'POST',
            body: 'invalid json'
        });

        const response = await POST(request);

        expect(response.status).toBe(500);
        expect(response.data).toEqual({
            success: false,
            message: 'Internal server error'
        });
        expect(mockRegister).not.toHaveBeenCalled();
    });

    it('should return 500 on unexpected errors', async () => {
        mockRegister.mockRejectedValue(new Error('Unexpected error'));

        const request = new Request('http://localhost:3000/api/user/register', {
            method: 'POST',
            body: JSON.stringify(mockRequestBody)
        });

        const response = await POST(request);

        expect(response.status).toBe(500);
        expect(response.data).toEqual({
            success: false,
            message: 'Internal server error'
        });
    });
});