import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export class AuthController {
    async login(userData) {
        try {
            const { username, password } = userData

            /* not sure if gonna put this in front or back
            if (!username || !password) {
                return {
                    status: 400,
                    body: { message: "Username and password are required."}
                };
            } */

            let role = "customer";
            if (username.startsWith("dw-")) {
                role = "dogWalker";
            } else if (username.startsWith("sp-")) {
                role = "serviceProvider";
            }

            // check if user exists or not
            let user;
            if (role === "dogWalker") {
                user = await prisma.dogWalker.findUnique({ where: { username } })
            } else if (role === "serviceProvider") {
                user = await prisma.serviceProvider.findUnique({ where: { username } })
            } else {
                user = await prisma.user.findUnique({ where: { username } })
            }

            if (!user) {
                return {
                    status: 401,
                    body: { message: "Couldn't find your username."}
                };
            }

            // check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return {
                    status: 401,
                    body: { message: "Your password is incorrect."}
                };
            }

            // generate JWT token
            const token = jwt.sign({ userId: user.id, username: user.username, role }, JWT_SECRET, {
                expiresIn: "1d"
            });

            return {
                status: 200,
                body: {
                    message: "Login successful.",
                    token,
                    user: { id: user.id, username: user.username, name: user.name }
                }
            };
        } catch (error) {
            console.error("Login error:", error);
            return {
            status: 500,
            body: { message: "Internal server error." }
            };
        }
    }
}
