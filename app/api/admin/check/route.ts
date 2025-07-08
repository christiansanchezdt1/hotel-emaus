import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: users, error } = await supabase.from("admin_users").select("username, email, created_at")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      users: users || [],
      count: users?.length || 0,
    })
  } catch (error) {
    console.error("Error checking admin:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
