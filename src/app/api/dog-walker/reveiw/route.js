import { NextResponse } from 'next/server';
import { SearchDWController } from "@/controllers/SearchDWController";
import {FetchReviewDW} from "@/controllers/FetchReviewDW";

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
        const body = await request.json();
        const { userId, dwId } = body;

        const fetchReviewDW = new FetchReviewDW();
        const result = await fetchReviewDW.getReviewByDwId(userId, dwId);

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
