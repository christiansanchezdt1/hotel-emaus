import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://nmdvilutbmkksaoxulvk.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZHZpbHV0Ym1ra3Nhb3h1bHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTA1MDEsImV4cCI6MjA2NzQ4NjUwMX0.oQL1zc8_lvZUjzSIUVHFZObVMweDhWSEuZ8-jIe-pnA"

// Cliente público para el frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente admin para API routes (usando la misma clave anónima)
export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Tipos de la base de datos
export interface Database {
  public: {
    Tables: {
      habitaciones: {
        Row: {
          id: number
          numero: string
          tipo: string
          precio: number
          capacidad: number
          descripcion: string | null
          amenidades: string[] | null
          estado: string
          created_at: string
        }
        Insert: {
          id?: number
          numero: string
          tipo: string
          precio: number
          capacidad: number
          descripcion?: string | null
          amenidades?: string[] | null
          estado?: string
          created_at?: string
        }
        Update: {
          id?: number
          numero?: string
          tipo?: string
          precio?: number
          capacidad?: number
          descripcion?: string | null
          amenidades?: string[] | null
          estado?: string
          created_at?: string
        }
      }
      reservas: {
        Row: {
          id: number
          habitacion_id: number
          cliente_nombre: string
          cliente_email: string
          cliente_telefono: string | null
          cliente_documento: string | null
          tipo_documento: string | null
          nacionalidad: string | null
          fecha_checkin: string
          fecha_checkout: string
          estado: string
          total: number
          created_at: string
        }
        Insert: {
          id?: number
          habitacion_id: number
          cliente_nombre: string
          cliente_email: string
          cliente_telefono?: string | null
          cliente_documento?: string | null
          tipo_documento?: string | null
          nacionalidad?: string | null
          fecha_checkin: string
          fecha_checkout: string
          estado?: string
          total: number
          created_at?: string
        }
        Update: {
          id?: number
          habitacion_id?: number
          cliente_nombre?: string
          cliente_email?: string
          cliente_telefono?: string | null
          cliente_documento?: string | null
          tipo_documento?: string | null
          nacionalidad?: string | null
          fecha_checkin?: string
          fecha_checkout?: string
          estado?: string
          total?: number
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: number
          username: string
          password_hash: string
          email: string
          created_at: string
        }
        Insert: {
          id?: number
          username: string
          password_hash: string
          email: string
          created_at?: string
        }
        Update: {
          id?: number
          username?: string
          password_hash?: string
          email?: string
          created_at?: string
        }
      }
    }
  }
}
