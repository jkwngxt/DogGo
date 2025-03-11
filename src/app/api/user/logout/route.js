import { NextResponse } from 'next/server';
import { LogoutController } from '@/controllers/LogoutController';

export async function POST() {
    try {
        const logoutController = new LogoutController();
        const result = await logoutController.logout();

        if (!result.success) {
            return NextResponse.json(result, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}