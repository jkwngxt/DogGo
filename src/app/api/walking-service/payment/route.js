import { PaymentController } from "@/controllers/PaymentController";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const paymentData = await request.json();
        const paymentController = new PaymentController();
        const response = await paymentController.processPayment(paymentData);
        
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