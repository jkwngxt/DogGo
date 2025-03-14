import { cookies } from 'next/headers';

export class LogoutController {
    async logout() {
        try {
            // ลบ token cookie
            const cookieStore = await cookies();
            cookieStore.delete('token');

            return {
                success: true,
                message: 'Logged out successfully'
            };
        } catch (error) {
            console.error('Logout error:', error);
            return {
                success: false,
                message: 'Failed to logout'
            };
        }
    }
}