import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db";
import { masjidView } from "@/app/db/schema";
import { and, eq, ilike, like } from "drizzle-orm";

export async function GET( request: NextRequest ) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");
    const offset = (page - 1) * limit;
    const stateId = searchParams.get("stateId");
    const cityId = searchParams.get("cityId");
    const name = searchParams.get("q");

    console.log(name);

    const filters = [];
    if (stateId) {
        filters.push(eq(masjidView.stateId, parseInt(stateId)));
    }
    if (cityId) {
        filters.push(eq(masjidView.cityId, parseInt(cityId)));
    }
    if (name) {
        filters.push(ilike(masjidView.name, `%${name}%`));
    }

    const data = await db.select()
        .from(masjidView)
        .limit(limit)
        .offset(offset)
        .where(filters.length > 0 ? and(...filters) : undefined);
    return NextResponse.json({ page, limit, data });
}