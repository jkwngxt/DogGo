import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { UseCouponController } from '@/controllers/UseCouponController';
import {authenticateRequest} from "@/utils/jwt";

const prisma = new PrismaClient();
const couponController = new UseCouponController(prisma);

export async function POST(request) {

    try {
        const { user, response } = await authenticateRequest(request, ["serviceProvider"]);
        if (response) return response;

        const body = await request.json();

        const {id} = body;

        const serviceProviderId = user.userId


        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Coupon ID is required' },
                { status: 400 }
            );
        }

        const result = await couponController.useCoupon(id, serviceProviderId);

        if (result.success) {
            return NextResponse.json(result, { status: 200 });
        } else {
            // If coupon not found, return 404
            if (result.message === 'Coupon not found') {
                return NextResponse.json(result, { status: 404 });
            }
            // For other errors, return 400
            return NextResponse.json(result, { status: 400 });
        }
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
            },
            { status: 500 }
        );
    }
}