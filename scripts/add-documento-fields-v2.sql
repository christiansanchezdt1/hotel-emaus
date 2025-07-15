-- ============================================
-- AGREGAR CAMPOS DE DOCUMENTO A RESERVAS
-- ============================================

-- Verificar estructura actual de la tabla
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY ordinal_position;

-- Agregar campos de documento y nacionalidad a la tabla reservas
ALTER TABLE reservas 
ADD COLUMN IF NOT EXISTS cliente_documento VARCHAR(50),
ADD COLUMN IF NOT EXISTS tipo_documento VARCHAR(20) DEFAULT 'DNI',
ADD COLUMN IF NOT EXISTS nacionalidad VARCHAR(100) DEFAULT 'Argentina';

-- Verificar que las columnas se agregaron correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'reservas' 
AND column_name IN ('cliente_documento', 'tipo_documento', 'nacionalidad')
ORDER BY column_name;

-- Actualizar reservas existentes con datos de ejemplo
UPDATE reservas 
SET 
  cliente_documento = CASE 
    WHEN id % 3 = 0 THEN LPAD((20000000 + id)::text, 8, '0')
    WHEN id % 3 = 1 THEN LPAD((30000000 + id)::text, 8, '0') 
    ELSE 'P' || LPAD(id::text, 7, '0')
  END,
  tipo_documento = CASE 
    WHEN id % 4 = 0 THEN 'PASAPORTE'
    ELSE 'DNI'
  END,
  nacionalidad = CASE 
    WHEN id % 4 = 0 THEN 'Brasil'
    WHEN id % 5 = 0 THEN 'Chile'
    WHEN id % 6 = 0 THEN 'Uruguay'
    ELSE 'Argentina'
  END
WHERE cliente_documento IS NULL OR cliente_documento = '';

-- Crear índices para búsquedas por documento
CREATE INDEX IF NOT EXISTS idx_reservas_documento ON reservas(cliente_documento);
CREATE INDEX IF NOT EXISTS idx_reservas_nacionalidad ON reservas(nacionalidad);
CREATE INDEX IF NOT EXISTS idx_reservas_tipo_documento ON reservas(tipo_documento);

-- Verificar los cambios aplicados
SELECT 'ESTRUCTURA ACTUALIZADA DE RESERVAS:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY ordinal_position;

-- Mostrar datos de ejemplo actualizados
SELECT 'DATOS DE EJEMPLO ACTUALIZADOS:' as info;
SELECT 
    id,
    cliente_nombre,
    cliente_documento,
    tipo_documento,
    nacionalidad,
    cliente_email,
    fecha_checkin,
    fecha_checkout,
    estado,
    '$' || FORMAT(total, 'FM999G999G999') || ' ARS' as total_formateado
FROM reservas 
ORDER BY created_at DESC
LIMIT 10;

-- Mostrar estadísticas por nacionalidad
SELECT 'ESTADÍSTICAS POR NACIONALIDAD:' as info;
SELECT 
    nacionalidad,
    tipo_documento,
    COUNT(*) as cantidad,
    '$' || FORMAT(AVG(total)::INTEGER, 'FM999G999G999') || ' ARS' as promedio_gasto
FROM reservas 
GROUP BY nacionalidad, tipo_documento
ORDER BY nacionalidad, tipo_documento;

-- Verificar que no hay valores nulos en campos críticos
SELECT 'VERIFICACIÓN DE INTEGRIDAD:' as info;
SELECT 
    COUNT(*) as total_reservas,
    COUNT(cliente_documento) as con_documento,
    COUNT(tipo_documento) as con_tipo_documento,
    COUNT(nacionalidad) as con_nacionalidad,
    COUNT(*) - COUNT(cliente_documento) as sin_documento
FROM reservas;

-- Mostrar algunos ejemplos de cada tipo de documento
SELECT 'EJEMPLOS POR TIPO DE DOCUMENTO:' as info;
SELECT DISTINCT
    tipo_documento,
    cliente_documento,
    nacionalidad,
    cliente_nombre
FROM reservas 
WHERE cliente_documento IS NOT NULL
ORDER BY tipo_documento, nacionalidad
LIMIT 20;
