import { POST } from "@/app/api/user/login/route";
import { AuthController } from "../controllers/AuthController";
import { describe, beforeEach, it, expect, jest } from "@jest/globals";

jest.mock("next/server", () => ({
    NextResponse: {
        json: jest.fn((data, options) => ({
            data,
            status: options?.status ?? 200,
            headers: { "Content-Type": "application/json" },
            json: jest.fn(async () => data)
        }))
    }
}));

jest.mock("../controllers/AuthController", () => ({
    AuthController: jest.fn().mockImplementation(() => ({
        login: jest.fn()
    }))
}));

describe("POST /api/user/login", () => {
    let mockLogin;
    let authController;

    beforeEach(() => {
        jest.clearAllMocks();
        authController = new AuthController(); 
        mockLogin = authController.login; 
    });

    it("should return 200 and a valid response on successful login", async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({
                username: "testCustomer",
                password: "password123"
            })
        };

        mockLogin.mockResolvedValueOnce({
            status: 200,
            body: {
                message: "Login successful.",
                token: "mocked_jwt_token",
                user: {
                    id: 1,
                    username: "testCustomer",
                    name: "Customer",
                    role: "customer"
                }
            }
        });

        const response = await POST(mockRequest);
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody.message).toBe("Login successful.");
        expect(responseBody.token).toBe("mocked_jwt_token");
        expect(responseBody.user).toEqual({
            id: 1,
            username: "testCustomer",
            name: "Customer",
            role: "customer"
        });
    });

    it("should return 401 when login fails", async () => {
        const mockRequest = {
            json: jest.fn().mockResolvedValue({
                username: "wrongUser",
                password: "wrongPassword"
            })
        };

        mockLogin.mockResolvedValueOnce({
            status: 401,
            body: { message: "Couldn't find your username." }
        });

        const response = await POST(mockRequest);
        const responseBody = await response.json();

        expect(response.status).toBe(401);
        expect(responseBody.message).toBe("Couldn't find your username.");
    });

    it("should return 500 on unexpected error", async () => {
        const mockRequest = {
            json: jest.fn().mockRejectedValue(new Error("Unexpected error"))
        };

        const response = await POST(mockRequest);
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody.message).toBe("Internal server error.");
    });
});