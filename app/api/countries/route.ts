import { fetchCountriesFromApi } from "@/lib/api"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const countries = await fetchCountriesFromApi()
        return NextResponse.json(countries)
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch countries, ${error}` }, { status: 500 })
    }
}
