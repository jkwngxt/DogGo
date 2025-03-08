import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        // ลบ token cookie
        const cookieStore = await cookies();
        cookieStore.delete('token');

        return NextResponse.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to logout' },
            { status: 500 }
        );
    }
}