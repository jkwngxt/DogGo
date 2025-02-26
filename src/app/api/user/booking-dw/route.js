import { NextResponse } from 'next/server';
import { BookDogWalkerController } from '@/controllers/BookDogWalkerController';

export async function POST(request) {
    try {
        const body = await request.json();
        const bookDogWalkerController = new BookDogWalkerController();
        const result = await bookDogWalkerController.bookDogWalker(body);

        if (!result.error) {
            return NextResponse.json(result, { status: 200 });
        }

        if (result.altFlow) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });

    } catch (error) {
        console.error("⚠️ API Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
