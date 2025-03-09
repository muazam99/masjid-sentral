import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db";
import { masjidView } from "@/app/db/schema";

export async function GET( request: NextRequest ) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");
    console.log("page:", page, "limit:", limit);
    const offset = (page - 1) * limit;
    const data = await db.select().from(masjidView).limit(limit).offset(offset);
    return NextResponse.json({ page, limit, data });
}