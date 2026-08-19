import { fetchStatesFromApi } from "@/lib/api"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const countryId = searchParams.get('countryId') || 'my'
        const states = await fetchStatesFromApi(countryId)
        return NextResponse.json(states)
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch states, ${error}`  }, { status: 500 })
    }
}
