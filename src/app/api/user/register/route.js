import { NextResponse } from 'next/server';
import { UserController } from '@/controllers/UserController';

export async function POST(request) {
    try {
        const body = await request.json();
        const userController = new UserController();
        const result = await userController.register(body);

        if (!result.success) {
            if (result.message.includes('already exists')) {
                return NextResponse.json(result, { status: 409 });
            }
            return NextResponse.json(result, { status: 500 });
        }

        return NextResponse.json(result, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
}