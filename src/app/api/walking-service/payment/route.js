import { WalkingServicePaymentController } from "@/controllers/WSPaymentController";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const paymentData = await request.json();
        const wsPaymentController = new WSPaymentController();
        const response = await wsPaymentController.processPayment(paymentData);
        
        return NextResponse.json(response, {
            status: response.status === "success" ? 200:400
        });
    } catch (error) {
        console.error("API payment error:", error);
        return NextResponse.json(
            { status: "failed", message: "Payment processing error" },
            { status: 500 }
        );
    }
}

