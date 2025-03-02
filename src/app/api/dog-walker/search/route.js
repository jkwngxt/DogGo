import { NextResponse } from 'next/server';
import { SearchDWController } from "@/controllers/SearchDWController";
import { authenticateRequest } from '@/utils/jwt';

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
        // ตรวจสอบการยืนยันตัวตนด้วย JWT
        // เฉพาะ customer เท่านั้นที่สามารถค้นหา dog walker ได้
        const { user, response } = await authenticateRequest(request, ['customer']);
        if (response) return response;

        const body = await request.json();
        const { date, startTimeInt, endTimeInt } = body;

        // Define constants
        const START_TIME = 9; // 9:00 AM is the first slot

        // Calculate slot indices
        let start = startTimeInt - START_TIME + 1;
        let end = endTimeInt - START_TIME;

        // Generate array of slots
        const timeSlots = [];
        for (let i = start; i < end; i++) {
            timeSlots.push(i);
        }

        // If 9.00-11.00 slot time will be [1, 2]

        const searchDWController = new SearchDWController();

        const result = await searchDWController.searchDogWalkers(date, timeSlots, user.userId);

        const serializedResult = serializeBigInt(result);

        return NextResponse.json(serializedResult);

    } catch (error) {
        console.error('Search dog walkers error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}