import { POST } from '@/app/api/dog-walker/register/route';
import { DogWalkerRegisterController } from '@/controllers/DogWalkerRegisterController';

jest.mock('@/controllers/DogWalkerRegisterController');
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn((data, options) => ({
            json: () => Promise.resolve(data),
            status: options.status,
        })),
    },
}));

describe('POST api/dog-walker/register', () => {
    let mockRequest;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRequest = {
            formData: jest.fn()
        };
    });

    test('should create dog walker successfully and return status 201', async () => {
        // Arrange
        const mockFormData = new Map();
        mockFormData.set('name', 'John Doe');
        mockFormData.set('username', 'dw-johndoe');
        mockFormData.set('email', 'john@example.com');
        mockFormData.set('pic', 'mock-image-file');

        mockRequest.formData.mockResolvedValue(mockFormData);

        DogWalkerRegisterController.prototype.register.mockResolvedValue({
            success: true,
            message: 'Dog Walker created successfully'
        });

        const response = await POST(mockRequest);
        const responseData = await response.json();

        expect(response.status).toBe(201);
        expect(responseData.success).toBe(true);
    });

    test('should return status 409 when data already exists', async () => {
        const mockFormData = new Map();
        mockFormData.set('name', 'John Doe');
        mockFormData.set('username', 'dw-johndoe');
        mockFormData.set('email', 'john@example.com');
        mockFormData.set('pic', 'mock-image-file');

        mockRequest.formData.mockResolvedValue(mockFormData);

        DogWalkerRegisterController.prototype.register.mockResolvedValue({
            success: false,
            message: 'Email already exists'
        });

        const response = await POST(mockRequest);
        const responseData = await response.json();

        expect(response.status).toBe(409);
        expect(responseData.success).toBe(false);
    });

    test('should return status 500 on general error', async () => {
        mockRequest.formData.mockRejectedValue(new Error('Something went wrong'));

        const response = await POST(mockRequest);
        const responseData = await response.json();

        expect(response.status).toBe(500);
        expect(responseData.success).toBe(false);
        expect(responseData.message).toBe('Internal server error');
    });

    test('should return status 500 when registration fails', async () => {
        // Arrange
        const mockFormData = new Map();
        mockFormData.set('name', 'John Doe');
        mockFormData.set('username', 'dw-johndoe');
        mockFormData.set('email', 'john@example.com');
        mockFormData.set('pic', 'mock-image-file');

        mockRequest.formData.mockResolvedValue(mockFormData);

        DogWalkerRegisterController.prototype.register.mockResolvedValue({
            success: false,
            message: 'Failed to save data'
        });

        const response = await POST(mockRequest);
        const responseData = await response.json();

        expect(response.status).toBe(500);
        expect(responseData.success).toBe(false);
    });
});
