import { ReviewSPController } from "@/controllers/ReviewSPController";
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/utils/jwt";

const reviewSPController = new ReviewSPController();

// get redeemed coupons for review
export async function GET(request) {
    try {
        // only login account can see this
        const { user, response } = await authenticateRequest(request);
        if (response) return response;

        const { searchParams } = new URL(request.url);
        const userId = parseInt(searchParams.get("userId"));

        if (!userId) {
            return NextResponse.json(
                { status: "failed", message: "User id is required"},
                { status: 400}
            );
        }

        const responseData = await reviewSPController.getRedeemableCoupons(userId);
        return NextResponse.json(responseData, { status: responseData.status === "success" ? 200 : 400});

    } catch (error) {
        console.error("API error (get coupons)");
        return NextResponse.json(
            { status: "failed", message: "Error fetching coupons"},
            { status: 500 }
        );
    }
}

// post to submit a new review
export async function POST(request) {
    try {
        // only login account can see this
        const { user, response } = await authenticateRequest(request);
        if (response) return response;

        const reviewData = await request.json();
        const responseData = await reviewSPController.createReview(reviewData);

        return NextResponse.json(responseData, { status: responseData.status === "success" ? 200:400 });
    } catch (error) {
        console.error("API error (post review)");
        return NextResponse.json(
            { status: "failed", message: "Error submitting review"},
            { status: 500 }
        );
    }
}