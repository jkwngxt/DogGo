import { PaymentController } from "@/controllers/PaymentController";

export async function POST(request) {
    try {
        const { userId, billingId, amount, confirmed } = await request.json();

        const response = await PaymentController.processPayment(
            userId,
            billingId,
            amount, 
            confirmed
        );

        return Response.json(response)
    } catch (error) {
        console.error("API payment error:", error);
        return Response.json(
            { status: "failed",
                message: "Payment processing error"
            },
            { status: 500 }
        );
    }
} 