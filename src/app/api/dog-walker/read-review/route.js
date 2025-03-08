import { NextResponse } from 'next/server';
import { FetchReviewDWController } from "@/controllers/FetchReviewDWController";
import { authenticateRequest } from "@/utils/jwt";

// Utility function for serializing BigInt values
function serializeBigInt(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (typeof value === 'bigint') {
            return Number(value);
        }
        return value;
    }));
}

export async function POST(request) {
    try {
        // Authentication check
        const { user, response } = await authenticateRequest(request);
        if (response) return response;

        // Extract user ID from authenticated session
        const userId = user.userId;

        // Parse request body
        const body = await request.json();
        const { dwId, startTimeInt, endTimeInt, date } = body;

        // Check for required parameters
        if (!dwId || !startTimeInt || !endTimeInt || !date) {
            return NextResponse.json(
                { success: false, message: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Create Date object from string parameters
        const dateTimeString = `${date} ${startTimeInt}:00:00`;
        const dateSearch = new Date(dateTimeString);

        // Get dog walker reviews using the controller
        const fetchReviewDW = new FetchReviewDWController();
        const result = await fetchReviewDW.getReviewByDwId(
            userId,
            dwId,
            startTimeInt,
            endTimeInt,
            dateSearch
        );

        // Handle unsuccessful results
        if (!result.success) {
            if (result.message.includes('not found')) {
                return NextResponse.json(result, { status: 404 });
            }
            return NextResponse.json(result, { status: 500 });
        }

        // Serialize BigInt values for JSON response
        const serializedResult = serializeBigInt(result);

        // Return successful response
        return NextResponse.json(serializedResult, { status: 200 });
    } catch (error) {
        console.error('Fetch review error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}