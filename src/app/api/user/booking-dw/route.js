import { NextResponse } from 'next/server';
import { BookDogWalkerController } from '@/controllers/BookDogWalkerController';
import { authenticateRequest } from '@/utils/jwt';
import {updateExpiredWalkingServices} from "@/utils/expire-billing";

export async function POST(request) {
    try {
        await updateExpiredWalkingServices()
        // only customer account can see this
        const { user, response } = await authenticateRequest(request, ['customer']);
        if (response) return response;

        const body = await request.json();
        const { date, startTimeInt, endTimeInt, dogIds, dogWalkerId, price } = body;

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

        const dateTimeString = `${date} ${startTimeInt}:00:00`;
        let dateSearch = new Date(dateTimeString);

        const data = {
            userId: user.userId,
            dogWalkerId: dogWalkerId,
            dogIds: dogIds,
            date: dateSearch,
            time: timeSlots,
            price: price
        };

        console.log(data);

        const bookDogWalkerController = new BookDogWalkerController();
        const result = await bookDogWalkerController.bookDogWalker(data);

        if (!result.error) {
            return NextResponse.json(result, { status: 200 });
        }

        if (result.altFlow) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });

    } catch (error) {
        console.error("API Error", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}