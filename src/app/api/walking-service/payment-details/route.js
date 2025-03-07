import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {authenticateRequest} from "@/utils/jwt";

const prisma = new PrismaClient();


export async function POST(request) {
    try {
        // ตรวจสอบ session
        const { user, response } = await authenticateRequest(request, ["customer"]);
        if (response) return response;

        // รับข้อมูลจาก request body
        const data = await request.json();
        const { walkingServiceId } = data;

        if (!walkingServiceId) {
            return NextResponse.json(
                { error: "ไม่พบข้อมูล Walking Service ID" },
                { status: 400 }
            );
        }

        // ดึงข้อมูล Walking Service และ Billing ที่เกี่ยวข้อง
        const walkingService = await prisma.walkingService.findUnique({
            where: {
                id: parseInt(walkingServiceId),
            },
            include: {
                billing: true,
                dogWalker: {
                    select: {
                        name: true,
                        pic: true,
                        tel: true,
                    },
                },
            },
        });

        // ตรวจสอบว่ามีข้อมูลหรือไม่
        if (!walkingService) {
            return NextResponse.json(
                { error: "ไม่พบข้อมูลการจอง" },
                { status: 404 }
            );
        }

        // ตรวจสอบว่าผู้ใช้เป็นเจ้าของการจองหรือไม่
        if (walkingService.userId !== user.userId) {
            return NextResponse.json(
                { error: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้" },
                { status: 403 }
            );
        }

        // ตรวจสอบว่ามีข้อมูลการชำระเงินหรือไม่
        if (!walkingService.billing) {
            return NextResponse.json(
                { error: "ไม่พบข้อมูลการชำระเงิน" },
                { status: 404 }
            );
        }

        // ดึงข้อมูลสุนัขที่เกี่ยวข้อง
        const dogIds = walkingService.dogs;
        const dogs = await prisma.dog.findMany({
            where: {
                id: {
                    in: dogIds,
                },
            },
            select: {
                id: true,
                name: true,
                breed: true,
            },
        });

        // สร้างเวลาหมดอายุการชำระเงิน (15 นาทีหลังจากสร้าง billing)
        const deadline = walkingService.billing.deadline;

        // ส่งข้อมูลการชำระเงินกลับไป
        return NextResponse.json({
            walkingServiceId: walkingService.id,
            billingId: walkingService.billing.id,
            amount: walkingService.billing.total,
            deadline: deadline,
            status: walkingService.billing.status,
            dogWalker: walkingService.dogWalker,
            time: walkingService.time, // เวลาที่จอง (array ของชั่วโมง)
            date: walkingService.date, // วันที่จอง
            dogs: dogs, // ข้อมูลสุนัข
        });
    } catch (error) {
        console.error("Error fetching payment details:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}