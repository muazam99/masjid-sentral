import { NextRequest, NextResponse } from "next/server";
import { getMasjidById } from "@/app/db/queries";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const masjidId = searchParams.get("id");

    if (!masjidId) {
        return NextResponse.json({ error: "Masjid ID is required" }, { status: 400 });
    }

    const data = await getMasjidById(parseInt(masjidId));

    return NextResponse.json(data);
}