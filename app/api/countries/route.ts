import { getCountries } from "@/app/db/queries"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const countries = await getCountries()
        return NextResponse.json(countries)
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch countries, ${error}` }, { status: 500 })
    }
}
