import { NextResponse } from 'next/server';
import { FetchReviewDWController } from "@/controllers/FetchReviewDWController";
import { authenticateRequest } from "@/utils/jwt";
import {FetchFeedbackDWController} from "@/controllers/FetchFeedbackDWController";

export async function GET(request) {
    try {
        // Authentication check
        const { user, response } = await authenticateRequest(request);
        if (response) return response;

        let dwId = user.userId;

        const fetchFeedbackDW = new FetchFeedbackDWController()
        const result = await fetchFeedbackDW.getFeedbackByDwId(dwId)

        if (!result.success) {
            if (result.message.includes('not found')) {
                return NextResponse.json(result, { status: 404 });
            }
            return NextResponse.json(result, { status: 500 });
        }

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error('Search dog walkers error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}