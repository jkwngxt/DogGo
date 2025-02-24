import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { AuthController } from "@/controllers/AuthController";

// mock prisma client
jest.mock("@prisma/client", () => ({
    PrismaClient: jest.fn(() => ({
        user: { findUnique: jest.fn() },
        dogWalker: { findUnique: jest.fn() },
        serviceProvider: { findUnique: jest.fn() }
    }))
}));

// mock bcryptjs
jest.mock("bcryptjs", () => ({
    compare: jest.fn()
}));

// mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
    sign: jest.fn()
}));

describe("AuthController", () => {
    let authController;
    let prismaClient;

    beforeEach(() => {
        jest.clearAllMocks();
        prismaClient = new PrismaClient();
        authController = new AuthController(prismaClient);
    });

    it("should successfully log in as customer", async () => {
        const mockUser = {
            id: 1,
            username: "testCustomer",
            name: "Customer",
            password: "hashedpassword",
            email: "test@example.com",
            tel: "1234567890",
            address: "123 Test St",
            zone: "Test Zone"
        };

        prismaClient.user.findUnique.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("mocked_jwt_token");

        const response = await authController.login({ username: "testCustomer", password: "password123" });

        // expect result
        expect(prismaClient.user.findUnique).toHaveBeenCalledWith({ where: { username: "testCustomer" } });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Login successful.");
        expect(response.body.token).toBe("mocked_jwt_token");
        expect(response.body.user).toEqual({
            id: 1,
            username: "testCustomer",
            name: "Customer",
            email: "test@example.com",
            tel: "1234567890",
            address: "123 Test St",
            zone: "Test Zone",
            role: "customer"
        });
    });

    it("should successfully log in as dogWalker", async () => {
        const mockDogWalker = {
            id: 2,
            username: "dw-dogWalker", // dog walker username should start with 'dw-'
            name: "Dog Walker",
            password: "hashedpassword",
            email: "dogwalker@example.com",
            tel: "0987654321",
            address: "456 Walker St",
            zone: ["Zone A", "Zone B"]
        };

        prismaClient.dogWalker.findUnique.mockResolvedValue(mockDogWalker); 

        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("mocked_jwt_token");

        const response = await authController.login({ username: "dw-dogWalker", password: "password123" });

        // expect result
        expect(prismaClient.dogWalker.findUnique).toHaveBeenCalledWith({ where: { username: "dw-dogWalker" } }); 
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Login successful.");
        expect(response.body.token).toBe("mocked_jwt_token");
        expect(response.body.user.role).toBe("dogWalker");
    });

    it("should successfully log in as serviceProvider", async () => {
        const mockServiceProvider = {
            id: 3,
            username: "sp-testServiceProvider", // service provider username should start with 'sp-'
            name: "Service Provider",
            password: "hashedpassword",
            email: "service@example.com",
            tel: "1122334455",
            address: "789 Service St",
            zone: "Service Zone"
        };

        prismaClient.serviceProvider.findUnique.mockResolvedValue(mockServiceProvider);

        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("mocked_jwt_token");

        const response = await authController.login({ username: "sp-testServiceProvider", password: "password123" });

        // expect result
        expect(prismaClient.serviceProvider.findUnique).toHaveBeenCalledWith({ where: { username: "sp-testServiceProvider" } }); // ✅ FIXED
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Login successful.");
        expect(response.body.token).toBe("mocked_jwt_token");
        expect(response.body.user.role).toBe("serviceProvider");
    });

    it("should return an error when user is not found", async () => {
        prismaClient.user.findUnique.mockResolvedValue(null);
        prismaClient.dogWalker.findUnique.mockResolvedValue(null);
        prismaClient.serviceProvider.findUnique.mockResolvedValue(null);

        const response = await authController.login({ username: "not-found", password: "password123" });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Couldn't find your username.");
    });

    it("should return an error when password is incorrect", async () => {
        const mockUser = {
            id: 1,
            username: "testCustomer",
            name: "Customer",
            password: "hashedpassword"
        };

        prismaClient.user.findUnique.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false); // false - password mismatch

        const response = await authController.login({ username: "testCustomer", password: "wrongPassword" });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Your password is incorrect.");
    });
});