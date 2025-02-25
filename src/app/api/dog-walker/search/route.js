import { NextResponse } from 'next/server';
import {SearchDWController} from "@/controllers/SearchDWController";

export async function POST(request) {
    try {
        const body = await request.json();
        const { date, startTimeInt, endTimeInt, userZone } = body;

        // Define constants
        const START_TIME = 9; // 9:00 AM is the first slot

        // Calculate slot indices
        let start = startTimeInt - START_TIME + 1;
        let end = endTimeInt - START_TIME + 1;

        // Generate array of slots
        const timeSlots = [];
        for (let i = start; i < end; i++) {
            timeSlots.push(i);
        }

        // If 9.00-11.00 slot time will be [1, 2]

        const searchDWController = new SearchDWController();
        const result = await searchDWController.searchDogWalkers(date, timeSlots, userZone);
        const serializedResult = {
            ...result,
            dogWalkers: result.dogWalkers.map(dw => ({
                ...dw,
                ratingCount: typeof dw.ratingCount === 'bigint' ? Number(dw.ratingCount) : dw.ratingCount
            }))
        };

        return NextResponse.json(serializedResult);

    } catch (error) {
        console.error('Search dog walkers error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

