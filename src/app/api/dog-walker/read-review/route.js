import { NextResponse } from 'next/server';
import { FetchReviewDWController } from "@/controllers/FetchReviewDWController";
import { authenticateRequest } from "@/utils/jwt";

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

        let userId = user.userId;

        const body = await request.json();
        const { dwId, startTimeInt, endTimeInt, date } = body;
        console.log('Request body:', body);

        // Ensure date is handled correctly with timezone information
        let parsedDate = null;
        if (date) {
            try {
                // Parse the ISO format date string with timezone
                parsedDate = date;
                console.log('Parsed date:', parsedDate);
            } catch (e) {
                console.error('Error parsing date:', e);
                // If parsing fails, use the date as-is
                parsedDate = date;
            }
        }

        const fetchReviewDW = new FetchReviewDWController();
        const result = await fetchReviewDW.getReviewByDwId(
            userId,
            dwId,
            startTimeInt,
            endTimeInt,
            parsedDate
        );

        if (!result.success) {
            if (result.message.includes('not found')) {
                return NextResponse.json(result, { status: 404 });
            }
            return NextResponse.json(result, { status: 500 });
        }

        const serializedResult = serializeBigInt(result);
        return NextResponse.json(serializedResult, { status: 200 });

    } catch (error) {
        console.error('Search dog walkers error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}