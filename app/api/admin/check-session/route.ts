import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getAdminSession()

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("Error checking session:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
