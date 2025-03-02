// File: app/api/user/booking-dw/route.js
import { NextResponse } from 'next/server';
import { BookDogWalkerController } from '@/controllers/BookDogWalkerController';
import { authenticateRequest } from '@/utils/jwt';

export async function POST(request) {
    try {
        // only customer account can see this
        const { user, response } = await authenticateRequest(request, ['customer']);
        if (response) return response;

        const body = await request.json();

        const { date, startTimeInt, endTimeInt, dogIds, dogWalkerId, price } = body;

        if (!date || !startTimeInt || !endTimeInt || !dogIds || !dogWalkerId || !price) {
            return NextResponse.json({
                error: "Dog walker is already booked for the requested time slots.",
                altFlow: true},
                { status: 400 });
        }

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

        const data = {
            userId: user.userId,
            dogWalkerId: dogWalkerId,
            dogIds: dogIds,
            date: date,
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