-- Agregar campos de documento y nacionalidad a la tabla reservas
ALTER TABLE reservas 
ADD COLUMN IF NOT EXISTS cliente_documento VARCHAR(50),
ADD COLUMN IF NOT EXISTS tipo_documento VARCHAR(20) DEFAULT 'DNI',
ADD COLUMN IF NOT EXISTS nacionalidad VARCHAR(100) DEFAULT 'Argentina';

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
WHERE cliente_documento IS NULL;

-- Crear índice para búsquedas por documento
CREATE INDEX IF NOT EXISTS idx_reservas_documento ON reservas(cliente_documento);
CREATE INDEX IF NOT EXISTS idx_reservas_nacionalidad ON reservas(nacionalidad);

-- Verificar los cambios
SELECT 
    id,
    cliente_nombre,
    cliente_documento,
    tipo_documento,
    nacionalidad,
    cliente_email,
    fecha_checkin,
    fecha_checkout,
    estado
FROM reservas 
ORDER BY created_at DESC
LIMIT 10;

-- Mostrar estadísticas por nacionalidad
SELECT 
    nacionalidad,
    tipo_documento,
    COUNT(*) as cantidad,
    '$' || FORMAT(AVG(total)::INTEGER, 'FM999G999G999') || ' ARS' as promedio_gasto
FROM reservas 
GROUP BY nacionalidad, tipo_documento
ORDER BY nacionalidad, tipo_documento;
