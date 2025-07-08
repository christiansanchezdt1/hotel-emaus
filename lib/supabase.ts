import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://nmdvilutbmkksaoxulvk.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZHZpbHV0Ym1ra3Nhb3h1bHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTA1MDEsImV4cCI6MjA2NzQ4NjUwMX0.oQL1zc8_lvZUjzSIUVHFZObVMweDhWSEuZ8-jIe-pnA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export interface Room {
  id: string
  name: string
  description: string
  price: number
  capacity: number
  size: string
  amenities: string[]
  image_url: string
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  room_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in: string
  check_out: string
  guests_count: number
  special_requests: string
  status: "pending" | "confirmed" | "cancelled"
  total_amount: number
  created_at: string
  rooms?: Room
}

export interface Admin {
  id: string
  email: string
  name: string
  created_at: string
}
