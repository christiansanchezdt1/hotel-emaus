import { createClient } from "@supabase/supabase-js"

// Configuración de Supabase con credenciales correctas
const supabaseUrl = "https://lajeagediejmbkdlqdon.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhamVhZ2VkaWVqbWJrZGxxZG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTA1ODMsImV4cCI6MjA2NzQ4NjU4M30.anOwuRFBK9HRcDAFgFUeoxITSPJEaVfxOJSGk7TiNCo"

console.log("🔧 Configurando Supabase...")
console.log("📡 URL:", supabaseUrl)
console.log("🔑 Key (primeros 20 chars):", supabaseKey.substring(0, 20) + "...")

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase configuration missing:", {
    url: !!supabaseUrl,
    key: !!supabaseKey,
    env: process.env.NODE_ENV,
  })
  throw new Error("Missing Supabase environment variables")
}

// Cliente público para operaciones generales
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

console.log("✅ Supabase client initialized:", {
  url: supabaseUrl.substring(0, 30) + "...",
  hasKey: !!supabaseKey,
  keyLength: supabaseKey.length,
})

// Tipos de base de datos
export interface Database {
  public: {
    Tables: {
      habitaciones: {
        Row: {
          id: number
          numero: string
          tipo: string
          capacidad: number
          precio: number
          descripcion: string | null
          amenidades: string[] | null
          disponible: boolean
          estado: string
          created_at: string
          updated_at: string
        }
        Insert: {
          numero: string
          tipo: string
          capacidad: number
          precio: number
          descripcion?: string | null
          amenidades?: string[] | null
          disponible?: boolean
          estado?: string
        }
        Update: {
          numero?: string
          tipo?: string
          capacidad?: number
          precio?: number
          descripcion?: string | null
          amenidades?: string[] | null
          disponible?: boolean
          estado?: string
        }
      }
      reservas: {
        Row: {
          id: number
          habitacion_id: number
          cliente_nombre: string
          cliente_email: string
          cliente_telefono: string | null
          cliente_documento: string
          tipo_documento: string
          nacionalidad: string
          fecha_checkin: string
          fecha_checkout: string
          total: number
          estado: string
          notas: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          habitacion_id: number
          cliente_nombre: string
          cliente_email: string
          cliente_telefono?: string | null
          cliente_documento: string
          tipo_documento: string
          nacionalidad: string
          fecha_checkin: string
          fecha_checkout: string
          total: number
          estado?: string
          notas?: string | null
        }
        Update: {
          habitacion_id?: number
          cliente_nombre?: string
          cliente_email?: string
          cliente_telefono?: string | null
          cliente_documento?: string
          tipo_documento?: string
          nacionalidad?: string
          fecha_checkin?: string
          fecha_checkout?: string
          total?: number
          estado?: string
          notas?: string | null
        }
      }
    }
  }
}

// Helper para crear cliente específico
export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
