import { WSPaymentController } from "@/controllers/WSPaymentController";
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/utils/jwt";

export async function POST(request) {
    try {
        // only customer account can see this
        const { user, response } = await authenticateRequest(request, ['customer']);
        if (response) return response;

        const paymentData = await request.json();
        const wsPaymentController = new WSPaymentController();
        const responseData = await wsPaymentController.processPayment(paymentData);
        
        return NextResponse.json(responseData, {
            status: responseData.success ? 200:400
        });
    } catch (error) {
        console.error("API payment error:", error);
        return NextResponse.json(
            { success: false, message: "Payment processing error" },
            { status: 500 }
        );
    }
}

