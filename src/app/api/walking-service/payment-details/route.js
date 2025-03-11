import { NextResponse } from "next/server";
import { PaymentDetailsController } from "@/controllers/PaymentDetailsController";
import { authenticateRequest } from "@/utils/jwt";

export async function POST(request) {
    try {
        // ตรวจสอบ session
        const { user, response } = await authenticateRequest(request, ["customer"]);
        if (response) return response;

        // รับข้อมูลจาก request body
        const data = await request.json();
        const { walkingServiceId } = data;

        const paymentDetailsController = new PaymentDetailsController();
        const result = await paymentDetailsController.getPaymentDetails(user.userId, walkingServiceId);

        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: result.status }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error("Error fetching payment details:", error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการดึงข้อมูลการชำระเงิน" },
            { status: 500 }
        );
    }
}