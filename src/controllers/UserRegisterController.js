import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export class UserRegisterController {
    constructor(prismaClient = new PrismaClient()) {
        this.prisma = prismaClient;
    }

    async register(userData) {
        return this.prisma.$transaction(async (tx) => {
            try {
                // Check if username exists
                const existingUsername = await tx.user.findUnique({
                    where: {username: userData.username}
                });

                if (existingUsername) {
                    return {
                        success: false,
                        message: 'Username already exists'
                    };
                }

                // Check if email exists
                const existingEmail = await tx.user.findUnique({
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

                // Create new user with dogs
                const newUser = await tx.user.create({
                    data: {
                        name: userData.name,
                        username: userData.username,
                        password: hashedPassword,
                        email: userData.email,
                        tel: userData.tel,
                        address: userData.address,
                        zone: userData.zone,
                        dogs: {
                            create: userData.dogs?.map(dog => ({
                                name: dog.name,
                                breed: dog.breed
                            })) || []
                        }
                    },
                    include: {
                        dogs: true // Include dogs in the response
                    }
                });

                const {password, ...userWithoutPassword} = newUser;

                return {
                    success: true,
                    message: 'User registered successfully',
                    user: userWithoutPassword
                };

            } catch (error) {
                // The transaction will automatically roll back on error
                return {
                    success: false,
                    message: 'Internal server error'
                };
            }
        });
    }
}