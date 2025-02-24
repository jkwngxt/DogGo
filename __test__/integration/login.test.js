import { POST } from '@/app/api/user/login/route';
import { AuthController } from '@/controllers/AuthController';
import { NextResponse } from 'next/server';

// suppress error logs during tests
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
jest.mock('@/controllers/AuthController');

jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((body, options) => ({
            json: () => Promise.resolve(body),
            status: options?.status || 200,
        })),
    },
}));

describe('POST /api/user/login', () => {
    let mockRequest;

    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = {
            json: jest.fn(),
        };
    });

    it('should return success response when login is successful', async () => {
        const loginData = {
            username: 'testUser', 
            password: 'password123',
        };

        const mockAuthResponse = {
            body: {
                token: 'fake-token',
                user: { id: 1, username: 'testUser' }, 
            },
            status: 200,
        };

        mockRequest.json.mockResolvedValue(loginData);
        AuthController.prototype.login.mockResolvedValue(mockAuthResponse);

        const response = await POST(mockRequest);
        const responseData = await response.json();

        expect(response.status).toBe(200);
        expect(responseData).toEqual(mockAuthResponse.body);
        expect(AuthController.prototype.login).toHaveBeenCalledWith(loginData);
        expect(NextResponse.json).toHaveBeenCalledWith(
            mockAuthResponse.body,
            { status: mockAuthResponse.status },
        );
    });

    it('should return error response when login fails', async () => {
        const loginData = {
            username: 'wrongUser',
            password: 'wrongPassword',
        };

        mockRequest.json.mockResolvedValue(loginData);
        AuthController.prototype.login.mockRejectedValue(new Error('Invalid credentials'));

        const response = await POST(mockRequest);
        const responseData = await response.json();

        expect(response.status).toBe(500);
        expect(responseData).toEqual({ message: 'Internal server error.' });
        expect(NextResponse.json).toHaveBeenCalledWith(
            { message: 'Internal server error.' },
            { status: 500 },
        );
    });

    it('should return 400 if missing fields', async () => {
        const loginData = {}; 

        const mockAuthResponse = {
            body: { message: 'Invalid input' },
            status: 400,
        };

        mockRequest.json.mockResolvedValue(loginData);
        AuthController.prototype.login.mockResolvedValue(mockAuthResponse);

        const response = await POST(mockRequest);
        const responseData = await response.json();

        expect(response.status).toBe(400);
        expect(responseData).toEqual({ message: 'Invalid input' });
        expect(AuthController.prototype.login).toHaveBeenCalledWith(loginData);
        expect(NextResponse.json).toHaveBeenCalledWith(
            { message: 'Invalid input' },
            { status: 400 },
        );
    });

    it('should return 401 when user is not found', async () => {
        const loginData = {
            username: 'notFoundUser', 
            password: 'password123',
        };

        const mockAuthResponse = {
            body: { message: 'Could not find your username.' },
            status: 401,
        };

        mockRequest.json.mockResolvedValue(loginData);
        AuthController.prototype.login.mockResolvedValue(mockAuthResponse);

        const response = await POST(mockRequest);
        const responseData = await response.json();

        expect(response.status).toBe(401);
        expect(responseData).toEqual({ message: 'Could not find your username.' });
        expect(AuthController.prototype.login).toHaveBeenCalledWith(loginData);
        expect(NextResponse.json).toHaveBeenCalledWith(
            { message: 'Could not find your username.' },
            { status: 401 },
        );
    });

    it('should return 401 when password is incorrect', async () => {
        const loginData = {
            username: 'testUser', 
            password: 'wrongPassword',
        };

        const mockAuthResponse = {
            body: { message: 'Your password is incorrect.' },
            status: 401,
        };

        mockRequest.json.mockResolvedValue(loginData);
        AuthController.prototype.login.mockResolvedValue(mockAuthResponse);

        const response = await POST(mockRequest);
        const responseData = await response.json();

        expect(response.status).toBe(401);
        expect(responseData).toEqual({ message: 'Your password is incorrect.' });
        expect(AuthController.prototype.login).toHaveBeenCalledWith(loginData);
        expect(NextResponse.json).toHaveBeenCalledWith(
            { message: 'Your password is incorrect.' },
            { status: 401 },
        );
    });

    it('should return 500 when a database error occurs', async () => {
        const loginData = {
            username: 'testUser', 
            password: 'password123',
        };

        mockRequest.json.mockResolvedValue(loginData);
        AuthController.prototype.login.mockRejectedValue(new Error('Database connection failed'));

        const response = await POST(mockRequest);
        const responseData = await response.json();

        expect(response.status).toBe(500);
        expect(responseData).toEqual({ message: 'Internal server error.' });
        expect(NextResponse.json).toHaveBeenCalledWith(
            { message: 'Internal server error.' },
            { status: 500 },
        );
    });
});