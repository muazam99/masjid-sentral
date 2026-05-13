import { getStates } from "@/app/db/queries"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const countryId = parseInt(searchParams.get('countryId') || '1')
        const states = await getStates(countryId)
        return NextResponse.json(states)
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch states, ${error}`  }, { status: 500 })
    }
}
