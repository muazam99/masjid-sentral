import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db";
import { masjidListView } from "@/app/db/schema";
import { and, eq, ilike } from "drizzle-orm";
import { getMasjidById } from "@/app/db/queries";

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
        filters.push(eq(masjidListView.stateId, parseInt(stateId)));
    }
    if (cityId) {
        filters.push(eq(masjidListView.cityId, parseInt(cityId)));
    }
    if (name) {
        filters.push(ilike(masjidListView.name, `%${name}%`));
    }

    const data = await db.select()
        .from(masjidListView)
        .limit(limit)
        .offset(offset)
        .where(filters.length > 0 ? and(...filters) : undefined);
    return NextResponse.json({ page, limit, data });
}

export async function GET_BY_ID(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const masjidId = searchParams.get("id");

    if (!masjidId) {
        return NextResponse.json({ error: "Masjid ID is required" }, { status: 400 });
    }

    const data = await getMasjidById(parseInt(masjidId));

    return NextResponse.json(data);
}