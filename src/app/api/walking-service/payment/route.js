import { PaymentController } from "@/controllers/PaymentController";

export async function POST(request) {
    try {
        const { userId, billingId, amount, confirmed } = await request.json();
        const paymentController = new PaymentController();
        const response = await paymentController.processPayment(
            userId,
            billingId,
            amount, 
            confirmed
        );

        return Response.json(response, {
            status: response.status === "success" ? 200:400
        });
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