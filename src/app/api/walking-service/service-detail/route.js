import { NextResponse } from 'next/server';
import { FetchWSController } from "@/controllers/FetchWSController";
import {authenticateRequest} from "@/utils/jwt";
import {updateExpiredWalkingServices} from "@/utils/expire-billing";

function serializeBigInt(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (typeof value === 'bigint') {
            return Number(value);
        }
        return value;
    }));
}

export async function GET(request) {
    try {
        const { user, response } = await authenticateRequest(request);
        if (response) return response;

        await updateExpiredWalkingServices()

        let role = user.role;
        let id = user.userId

        if (!role || !id) {
            return NextResponse.json(
                { success: false, message: 'Missing required parameters' },
                { status: 400 }
            );
        }

        const fetchWSList = new FetchWSController();
        const result = await fetchWSList.getWSList(role, id);

        if (!result.success) {
            return NextResponse.json(result, { status: 404 });
        }

        const serializedResult = serializeBigInt(result);
        return NextResponse.json(serializedResult, { status: 200 });

    } catch (error) {
        console.error('Fetch walking services error:', error);
        return NextResponse.json(
            { success: false,
                message: 'Internal server error' },
            { status: 500 }
        );
    }
}