import { NextResponse } from "next/server";
import { ReviewDWController } from "@/controllers/ReviewDWController";
import { authenticateRequest } from "@/utils/jwt";

const reviewDWController = new ReviewDWController();

// noted: both test send api with postman (without authentication) passed
// get reviewable walking services
export async function GET(request) {
    try {
        const { user, response } = await authenticateRequest(request);
        if (response) return response;

        const result = await reviewDWController.getReviewableWalkingService(user.id);
        return NextResponse.json(result, { status: result.success ? 200:400 });
    } catch (error) {
        console.error("Error fetching reviewable walking services:", error);
        return NextResponse.json(
            { success: false, message: "Error fetching walking services" },
            { status: 500 }
        );
    }
}

// post submit a review
export async function POST(request) {
    try {
        const { user, response } = await authenticateRequest(request)
        if (response) return response;

        const reviewData = await request.json();
        reviewData.userId = user.userId;
        
        const result = await reviewDWController.createReview(reviewData);

        return NextResponse.json(result, { status: result.success ? 201:400 });
    } catch (error) {
        console.error("Error submitting review:", error);
        return NextResponse.json(
            { success: false, message: "Error submitting review" },
            { status: 500 }
        );
    }
}