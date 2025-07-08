-- Actualizar precios de habitaciones a pesos argentinos
-- Conversión aproximada: 1 USD = 1000 ARS (ajustable según tipo de cambio)

UPDATE habitaciones SET precio = CASE 
    WHEN tipo = 'Individual' THEN 
        CASE 
            WHEN precio <= 80 THEN 25000
            WHEN precio <= 85 THEN 28000
            WHEN precio <= 90 THEN 30000
            ELSE 32000
        END
    WHEN tipo = 'Doble' THEN 
        CASE 
            WHEN precio <= 120 THEN 45000
            WHEN precio <= 125 THEN 48000
            WHEN precio <= 130 THEN 50000
            WHEN precio <= 140 THEN 52000
            ELSE 55000
        END
    WHEN tipo = 'Suite Familiar' THEN 
        CASE 
            WHEN precio <= 180 THEN 75000
            WHEN precio <= 185 THEN 78000
            WHEN precio <= 200 THEN 85000
            ELSE 90000
        END
    WHEN tipo = 'Suite Premium' THEN 
        CASE 
            WHEN precio <= 250 THEN 120000
            ELSE 150000
        END
    ELSE precio * 400 -- Fallback para otros tipos
END;

-- Actualizar también las reservas existentes para que coincidan
UPDATE reservas SET total = CASE 
    WHEN total <= 200 THEN total * 400
    WHEN total <= 500 THEN total * 350
    WHEN total <= 1000 THEN total * 300
    ELSE total * 250
END;

-- Verificar los cambios
SELECT 
    numero,
    tipo,
    precio as precio_ars,
    capacidad,
    estado
FROM habitaciones 
ORDER BY numero;

-- Verificar reservas actualizadas
SELECT 
    r.id,
    r.cliente_nombre,
    h.numero as habitacion,
    h.tipo,
    h.precio as precio_por_noche,
    r.fecha_checkin,
    r.fecha_checkout,
    r.total as total_ars,
    r.estado
FROM reservas r
JOIN habitaciones h ON r.habitacion_id = h.id
ORDER BY r.created_at DESC;

-- Mostrar estadísticas de precios
SELECT 
    'PRECIOS EN PESOS ARGENTINOS' as info,
    tipo,
    MIN(precio) as precio_minimo,
    MAX(precio) as precio_maximo,
    AVG(precio)::INTEGER as precio_promedio,
    COUNT(*) as cantidad
FROM habitaciones 
GROUP BY tipo
ORDER BY precio_promedio;
