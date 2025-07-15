-- Script para probar la validación de documentos después de agregar las columnas

-- Verificar que las columnas existen
SELECT 'VERIFICANDO COLUMNAS DE DOCUMENTO:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'reservas' 
AND column_name IN ('cliente_documento', 'tipo_documento', 'nacionalidad');

-- Insertar algunas reservas de prueba con diferentes tipos de documento
INSERT INTO reservas (
    habitacion_id, 
    cliente_nombre, 
    cliente_email, 
    cliente_telefono,
    cliente_documento,
    tipo_documento,
    nacionalidad,
    fecha_checkin, 
    fecha_checkout, 
    estado, 
    total
) VALUES
-- DNI argentino válido
(1, 'Juan Carlos Pérez', 'juan.perez@email.com', '+54911234567', '12345678', 'DNI', 'Argentina', CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', 'confirmada', 50000),

-- Pasaporte brasileño
(2, 'Maria Silva Santos', 'maria.silva@email.com', '+5511987654321', 'BR123456', 'PASAPORTE', 'Brasil', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', 'confirmada', 84000),

-- DNI argentino de 7 dígitos
(3, 'Carlos Alberto López', 'carlos.lopez@email.com', '+54911111111', '1234567', 'DNI', 'Argentina', CURRENT_DATE + INTERVAL '3 days', CURRENT_DATE + INTERVAL '6 days', 'confirmada', 75000),

-- Pasaporte estadounidense
(4, 'John Smith', 'john.smith@email.com', '+1234567890', 'US987654321', 'PASAPORTE', 'Estados Unidos', CURRENT_DATE + INTERVAL '4 days', CURRENT_DATE + INTERVAL '7 days', 'confirmada', 90000),

-- Pasaporte chileno
(5, 'Ana María González', 'ana.gonzalez@email.com', '+56912345678', 'CL456789', 'PASAPORTE', 'Chile', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '8 days', 'confirmada', 144000);

-- Verificar los datos insertados
SELECT 'RESERVAS DE PRUEBA INSERTADAS:' as info;
SELECT 
    id,
    cliente_nombre,
    cliente_documento,
    tipo_documento,
    nacionalidad,
    fecha_checkin,
    fecha_checkout,
    '$' || total::text || ' ARS' as total
FROM reservas 
WHERE cliente_documento IN ('12345678', 'BR123456', '1234567', 'US987654321', 'CL456789')
ORDER BY created_at DESC;

-- Estadísticas por tipo de documento
SELECT 'ESTADÍSTICAS POR TIPO DE DOCUMENTO:' as info;
SELECT 
    tipo_documento,
    COUNT(*) as cantidad,
    '$' || ROUND(AVG(total))::text || ' ARS' as promedio
FROM reservas 
WHERE cliente_documento IS NOT NULL
GROUP BY tipo_documento
ORDER BY tipo_documento;

-- Estadísticas por nacionalidad
SELECT 'ESTADÍSTICAS POR NACIONALIDAD:' as info;
SELECT 
    nacionalidad,
    COUNT(*) as cantidad,
    '$' || ROUND(AVG(total))::text || ' ARS' as promedio
FROM reservas 
WHERE nacionalidad IS NOT NULL
GROUP BY nacionalidad
ORDER BY cantidad DESC;

-- Verificar patrones de documentos
SELECT 'PATRONES DE DOCUMENTOS:' as info;
SELECT 
    tipo_documento,
    cliente_documento,
    LENGTH(cliente_documento) as longitud,
    CASE 
        WHEN tipo_documento = 'DNI' AND cliente_documento ~ '^\d{7,8}$' THEN 'VÁLIDO'
        WHEN tipo_documento = 'PASAPORTE' AND cliente_documento ~ '^[A-Z0-9]{6,}$' THEN 'VÁLIDO'
        ELSE 'REVISAR'
    END as validacion
FROM reservas 
WHERE cliente_documento IS NOT NULL
ORDER BY tipo_documento, cliente_documento;
