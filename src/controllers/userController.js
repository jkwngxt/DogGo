import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';

export class UserController {
    constructor(prismaClient = new PrismaClient()) {
        this.prisma = prismaClient;
    }

    async register(userData) {
        try {
            // Check if username exists
            const existingUsername = await this.prisma.user.findFirst({
                where: {username: userData.username}
            });

            if (existingUsername) {
                return {
                    success: false,
                    message: 'Username already exists'
                };
            }

            // Check if email exists
            const existingEmail = await this.prisma.user.findFirst({
                where: {email: userData.email}
            });

            if (existingEmail) {
                return {
                    success: false,
                    message: 'Email already exists'
                };
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Create new user
            const newUser = await this.prisma.user.create({
                data: {
                    name: userData.name,
                    username: userData.username,
                    password: hashedPassword,
                    email: userData.email,
                    tel: userData.tel,
                    address: userData.address,
                    zone: userData.zone
                }
            });

            const {password, ...userWithoutPassword} = newUser;

            return {
                success: true,
                message: 'User registered successfully',
                user: userWithoutPassword
            };

        } catch (error) {
            return {
                success: false,
                message: 'Internal server error'
            };
        }
    }
}