import { getStates } from "@/app/db/queries"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const states = await getStates()
        return NextResponse.json(states)
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch states, ${error}`  }, { status: 500 })
    }
}
