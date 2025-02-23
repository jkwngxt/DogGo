import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generatePassword } from '@/utils/passwordGenerator.js';
import { EmailService } from '@/utils/emailService.js';
import {FileUploadService} from "@/utils/fileUpload";

export class DogWalkerController {
    constructor(prismaClient = new PrismaClient()) {
        this.prisma = prismaClient;
        this.emailService = new EmailService();
        this.fileUploadService = new FileUploadService();
    }

    async register(dogWalkerData, imageFile) {
        return this.prisma.$transaction(async (tx) => {
            try {
                // Check if username exists
                const existingUsername = await tx.dogWalker.findFirst({
                    where: { username: dogWalkerData.username }
                });

                if (existingUsername) {
                    return {
                        success: false,
                        message: 'Username already exists'
                    };
                }

                // Check if email exists
                const existingEmail = await tx.dogWalker.findFirst({
                    where: { email: dogWalkerData.email }
                });

                if (existingEmail) {
                    return {
                        success: false,
                        message: 'Email already exists'
                    };
                }

                // Generate random password
                const plainPassword = generatePassword(12);
                const hashedPassword = await bcrypt.hash(plainPassword, 10);

                // Create new dog walker
                const newDogWalker = await tx.dogWalker.create({
                    data: {
                        name: dogWalkerData.name,
                        username: dogWalkerData.username,
                        password: hashedPassword,
                        email: dogWalkerData.email,
                        pic: '',
                    }
                });

                // Upload image if provided
                if (imageFile) {
                    try {
                        const imagePath = await this.fileUploadService.uploadImage(imageFile, newDogWalker.id);

                        // Update dog walker with image path
                        await tx.dogWalker.update({
                            where: { id: newDogWalker.id },
                            data: { pic: imagePath }
                        });
                    } catch (uploadError) {
                        console.error('Image upload failed:', uploadError);

                        await tx.dogWalker.delete({
                            where: { id: newDogWalker.id }
                        });

                        return {
                            success: false,
                            message: `Image upload failed: ${uploadError}`
                        };
                    }
                }

                // Send welcome email with credentials
                const emailSent = await this.emailService.sendWelcomeEmail(
                    dogWalkerData.email,
                    dogWalkerData.username,
                    plainPassword
                );

                if (!emailSent) {
                    await tx.dogWalker.delete({
                        where: { id: newDogWalker.id }
                    });

                    return {
                        success: false,
                        message: 'Dog walker registered, but email sending failed. Registration has been rolled back.'
                    };
                }

                const { password, ...dogWalkerWithoutPassword } = newDogWalker;

                return {
                    success: true,
                    message: 'Dog walker registered successfully and welcome email sent',
                    dogWalker: dogWalkerWithoutPassword
                };

            } catch (error) {
                console.error('Registration error:', error);
                return {
                    success: false,
                    message: 'Internal server error'
                };
            }
        });
    }
}