import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export class LoginController {
    constructor(prismaInstance = new PrismaClient()) {
        this.prisma = prismaInstance;
    }

    async login(userData) {
        try {
            const { username, password } = userData

            let role = "customer";
            if (username.startsWith("dw-")) {
                role = "dogWalker";
            } else if (username.startsWith("sp-")) {
                role = "serviceProvider";
            }

            // check if user exists or not
            let user;
            if (role === "dogWalker") {
                user = await this.prisma.dogWalker.findUnique({ where: { username } })
            } else if (role === "serviceProvider") {
                user = await this.prisma.serviceProvider.findUnique({ where: { username } })
            } else {
                user = await this.prisma.user.findUnique({ where: { username } })
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
            const token = jwt.sign(
                { userId: user.id, username: user.username, role },
                JWT_SECRET,
                { expiresIn: "1d" }
            );

            const userResponse = {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                tel: user.tel,
                address: user.address,
                zone: user.zone,
                role
            };

            // specific fields
            if (role === "dogWalker") {
                userResponse.pic = user.pic;
            } else if (role === "serviceProvider") {
                userResponse.des = user.des;
            }

            return {
                status: 200,
                body: {
                    message: "Login successful.",
                    token,
                    user: userResponse
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
