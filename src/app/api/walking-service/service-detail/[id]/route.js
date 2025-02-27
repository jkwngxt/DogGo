// app/api/walking-service/service-detail/[id]/route.js
import { NextResponse } from 'next/server';
import { FetchWSController } from '@/controllers/FetchWSController';

const wsController = new FetchWSController();

export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Service ID is required' },
                { status: 400 }
            );
        }

        const serviceId = parseInt(id);

        if (isNaN(serviceId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid service ID, must be a number' },
                { status: 400 }
            );
        }

        const result = await wsController.getWSDetail(serviceId);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error in walking service detail route:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred' },
            { status: 500 }
        );
    }
}