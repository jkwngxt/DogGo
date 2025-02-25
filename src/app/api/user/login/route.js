import { NextResponse } from "next/server";
import { AuthController } from "@/controllers/LoginController";

const authcontroller = new AuthController();

export async function POST(request) {
    try {
        const body = await request.json();
        const response = await authcontroller.login(body);

        return NextResponse.json(response.body, { status: response.status });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}