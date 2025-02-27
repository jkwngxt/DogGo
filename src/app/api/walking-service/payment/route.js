import { WalkingServicePaymentController } from "@/controllers/WalkingServicePaymentController";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const paymentData = await request.json();
        const walkingServicePaymentController = new WalkingServicePaymentController();
        const response = await walkingServicePaymentController.processPayment(paymentData);
        
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
