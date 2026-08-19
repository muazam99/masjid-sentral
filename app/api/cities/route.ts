import { fetchCitiesFromApi } from "@/lib/api"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const stateId = searchParams.get('stateId')
        
        if (!stateId) {
            return NextResponse.json({ error: "State ID is required" }, { status: 400 })
        }

        const cities = await fetchCitiesFromApi(stateId)
        return NextResponse.json(cities)
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch cities, ${error}` }, { status: 500 })
    }
}
