import { EmailService } from '@/utils/emailService';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const emailService = new EmailService();

export async function POST(request) {
    try {
        const data = await request.json();
        const { walkingServiceId } = data;

        if (!walkingServiceId) {
            return NextResponse.json(
                { error: 'Walking service ID is required' },
                { status: 400 }
            );
        }

        const walkingService = await prisma.walkingService.findUnique({
            where: { id: walkingServiceId },
            include: {
                dogWalker: true,
                user: true
            }
        });

        if (!walkingService) {
            return NextResponse.json(
                { error: 'Walking service not found' },
                { status: 404 }
            );
        }

        // ดึงข้อมูลสุนัข
        const dogs = await prisma.dog.findMany({
            where: {
                id: { in: walkingService.dogs }
            }
        });

        // สร้าง time slots จาก array ของเวลา
        const startSlot = Math.min(...walkingService.time);
        const endSlot = Math.max(...walkingService.time);

        // สร้าง booking notification email
        const bookingDetails = {
            userName: walkingService.user.name,
            userEmail: walkingService.user.email,
            userTel: walkingService.user.tel,
            userAddress: walkingService.user.address,
            dogs: dogs,
            serviceDate: walkingService.date.toISOString().split('T')[0],
            startSlot,
            endSlot,
            totalPrice: walkingService.price.toString()
        };

        console.log(walkingService.dogWalker.username)
        const emailPath = await emailService.sendBookingNotification(
            walkingServiceId,
            walkingService.dogWalker.username,
            bookingDetails
        );

        return NextResponse.json(
            { success: true, emailPath },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending booking notification:', error);
        return NextResponse.json(
            { error: 'Failed to send booking notification' },
            { status: 500 }
        );
    }
}