-- Agregar columna 'notas' a la tabla reservas
ALTER TABLE reservas 
ADD COLUMN IF NOT EXISTS notas TEXT;

-- Comentario explicativo
COMMENT ON COLUMN reservas.notas IS 'Notas adicionales sobre la reserva';

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reservas' AND column_name = 'notas';
