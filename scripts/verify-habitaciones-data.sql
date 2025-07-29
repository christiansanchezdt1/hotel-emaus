-- Verificación completa del sistema de habitaciones
-- Script actualizado para el esquema real

-- 1. Verificar estructura de la tabla habitaciones
SELECT 
    'Estructura tabla habitaciones' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'habitaciones' 
ORDER BY ordinal_position;

-- 2. Verificar estructura de la tabla reservas (si existe)
SELECT 
    'Estructura tabla reservas' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'reservas' 
ORDER BY ordinal_position;

-- 3. Contar habitaciones por estado
SELECT 
    'Habitaciones por estado' as info,
    estado,
    COUNT(*) as cantidad
FROM habitaciones 
GROUP BY estado
ORDER BY cantidad DESC;

-- 4. Contar habitaciones por tipo
SELECT 
    'Habitaciones por tipo' as info,
    tipo,
    COUNT(*) as cantidad,
    AVG(precio) as precio_promedio,
    MIN(precio) as precio_minimo,
    MAX(precio) as precio_maximo
FROM habitaciones 
GROUP BY tipo
ORDER BY cantidad DESC;

-- 5. Verificar datos de habitaciones
SELECT 
    'Datos de habitaciones' as info,
    id,
    numero,
    tipo,
    capacidad,
    precio,
    estado,
    CASE 
        WHEN descripcion IS NOT NULL THEN 'Tiene descripción'
        ELSE 'Sin descripción'
    END as descripcion_status,
    CASE 
        WHEN amenidades IS NOT NULL AND array_length(amenidades, 1) > 0 THEN 'Tiene amenidades'
        ELSE 'Sin amenidades'
    END as amenidades_status,
    created_at
FROM habitaciones 
ORDER BY numero;

-- 6. Verificar amenidades (formato array)
SELECT 
    'Amenidades por habitación' as info,
    numero,
    tipo,
    CASE 
        WHEN amenidades IS NULL THEN 'Sin amenidades'
        WHEN array_length(amenidades, 1) IS NULL THEN 'Array vacío'
        ELSE array_to_string(amenidades, ', ')
    END as amenidades_info
FROM habitaciones 
ORDER BY numero
LIMIT 10;

-- 7. Resumen general del sistema
SELECT 
    'Total Habitaciones' as concepto,
    COUNT(*) as valor
FROM habitaciones
UNION ALL
SELECT 
    'Habitaciones Disponibles' as concepto,
    COUNT(*) as valor
FROM habitaciones 
WHERE estado = 'disponible'
UNION ALL
SELECT 
    'Habitaciones Ocupadas' as concepto,
    COUNT(*) as valor
FROM habitaciones 
WHERE estado = 'ocupada'
UNION ALL
SELECT 
    'Habitaciones en Mantenimiento' as concepto,
    COUNT(*) as valor
FROM habitaciones 
WHERE estado = 'mantenimiento'
UNION ALL
SELECT 
    'Habitaciones Fuera de Servicio' as concepto,
    COUNT(*) as valor
FROM habitaciones 
WHERE estado = 'fuera_servicio';

-- 8. Verificar integridad de datos
SELECT 
    'Habitaciones sin precio' as problema,
    COUNT(*) as cantidad
FROM habitaciones 
WHERE precio IS NULL OR precio <= 0
UNION ALL
SELECT 
    'Habitaciones sin tipo' as problema,
    COUNT(*) as cantidad
FROM habitaciones 
WHERE tipo IS NULL OR tipo = ''
UNION ALL
SELECT 
    'Habitaciones sin número' as problema,
    COUNT(*) as cantidad
FROM habitaciones 
WHERE numero IS NULL OR numero = ''
UNION ALL
SELECT 
    'Habitaciones con capacidad inválida' as problema,
    COUNT(*) as cantidad
FROM habitaciones 
WHERE capacidad IS NULL OR capacidad <= 0;

-- 9. Verificar rangos de precios por tipo
SELECT 
    'Rangos de precios por tipo' as info,
    tipo,
    COUNT(*) as cantidad,
    MIN(precio) as precio_min,
    MAX(precio) as precio_max,
    AVG(precio) as precio_promedio,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY precio) as precio_mediano
FROM habitaciones 
WHERE precio > 0
GROUP BY tipo
ORDER BY precio_promedio DESC;

-- 10. Verificar capacidades por tipo
SELECT 
    'Capacidades por tipo' as info,
    tipo,
    MIN(capacidad) as capacidad_min,
    MAX(capacidad) as capacidad_max,
    AVG(capacidad) as capacidad_promedio,
    COUNT(*) as cantidad_habitaciones
FROM habitaciones 
GROUP BY tipo
ORDER BY capacidad_promedio DESC;

-- 11. Habitaciones disponibles para reserva
SELECT 
    'Habitaciones disponibles para reserva' as info,
    id,
    numero,
    tipo,
    capacidad,
    precio,
    CASE 
        WHEN amenidades IS NOT NULL AND array_length(amenidades, 1) > 0 
        THEN array_to_string(amenidades, ', ')
        ELSE 'Sin amenidades'
    END as amenidades,
    created_at
FROM habitaciones 
WHERE estado = 'disponible'
ORDER BY precio ASC;

-- 12. Estadísticas de ocupación (simulada)
SELECT 
    'Estadísticas de ocupación' as info,
    estado,
    COUNT(*) as cantidad,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM habitaciones)), 2) as porcentaje
FROM habitaciones 
GROUP BY estado
ORDER BY cantidad DESC;

-- 13. Verificar índices existentes
SELECT 
    'Índices en tabla habitaciones' as info,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'habitaciones'
ORDER BY indexname;

-- 14. Verificar constraints
SELECT 
    'Constraints en tabla habitaciones' as info,
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'habitaciones'::regclass
ORDER BY conname;

-- 15. Test de inserción (simulado - solo verificar estructura)
SELECT 
    'Test estructura para inserción' as info,
    'numero, tipo, precio, capacidad, descripcion, amenidades, estado' as campos_requeridos,
    'varchar(10), varchar(50), numeric(10,2), integer, text, text[], varchar(20)' as tipos_datos;
