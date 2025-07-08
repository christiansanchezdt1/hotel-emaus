-- Limpiar habitaciones de prueba anteriores si existen
DELETE FROM habitaciones WHERE numero IN ('105', '106', '205', '206', '303', '107', '207', '108');

-- Insertar habitaciones adicionales para probar eliminación
-- Precios en PESOS ARGENTINOS
INSERT INTO habitaciones (numero, tipo, precio, capacidad, descripcion, amenidades, estado) VALUES

-- Habitaciones que se pueden eliminar (sin reservas) - PRECIOS EN ARS
('105', 'Individual', 22000, 1, 'Habitación individual básica para pruebas de eliminación', ARRAY['wifi'], 'disponible'),
('106', 'Individual', 35000, 1, 'Habitación individual premium para pruebas', ARRAY['wifi', 'desayuno'], 'disponible'),
('205', 'Doble', 42000, 2, 'Habitación doble económica para pruebas', ARRAY['wifi', 'estacionamiento'], 'disponible'),
('206', 'Doble', 58000, 2, 'Habitación doble con vista para pruebas', ARRAY['wifi', 'desayuno', 'estacionamiento'], 'disponible'),
('303', 'Suite Familiar', 95000, 4, 'Suite familiar para pruebas de eliminación', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad'], 'disponible'),

-- Habitaciones en mantenimiento (no se pueden eliminar por estado)
('107', 'Individual', 28000, 1, 'Habitación en mantenimiento - no eliminable', ARRAY['wifi'], 'mantenimiento'),
('207', 'Doble', 48000, 2, 'Habitación en mantenimiento - no eliminable', ARRAY['wifi', 'estacionamiento'], 'mantenimiento'),

-- Habitación fuera de servicio (no se puede eliminar por estado)
('108', 'Individual', 32000, 1, 'Habitación fuera de servicio - no eliminable', ARRAY['wifi'], 'fuera_servicio'),

-- Habitaciones premium adicionales
('304', 'Suite Familiar', 110000, 4, 'Suite familiar de lujo con jacuzzi', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad', 'recepcion_24h'], 'disponible'),
('402', 'Suite Premium', 180000, 2, 'Suite presidencial con vista panorámica', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad', 'recepcion_24h'], 'disponible');

-- Verificar las habitaciones insertadas con precios en ARS
SELECT 
    h.id,
    h.numero,
    h.tipo,
    '$' || FORMAT(h.precio, 'FM999G999G999') || ' ARS' as precio_formateado,
    h.capacidad,
    h.estado,
    COUNT(r.id) as reservas_activas
FROM habitaciones h
LEFT JOIN reservas r ON h.id = r.habitacion_id AND r.estado IN ('confirmada', 'checkin')
GROUP BY h.id, h.numero, h.tipo, h.precio, h.capacidad, h.estado
ORDER BY h.precio DESC;

-- Mostrar estadísticas con precios en ARS
SELECT 
    'ESTADÍSTICAS DE HABITACIONES (ARS)' as info,
    tipo,
    COUNT(*) as cantidad,
    '$' || FORMAT(MIN(precio), 'FM999G999G999') || ' ARS' as precio_minimo,
    '$' || FORMAT(MAX(precio), 'FM999G999G999') || ' ARS' as precio_maximo,
    '$' || FORMAT(AVG(precio)::INTEGER, 'FM999G999G999') || ' ARS' as precio_promedio
FROM habitaciones 
GROUP BY tipo
ORDER BY AVG(precio) DESC;

-- Mostrar rango de precios general
SELECT 
    'RANGO DE PRECIOS GENERAL' as categoria,
    '$' || FORMAT(MIN(precio), 'FM999G999G999') || ' ARS' as precio_mas_bajo,
    '$' || FORMAT(MAX(precio), 'FM999G999G999') || ' ARS' as precio_mas_alto,
    '$' || FORMAT(AVG(precio)::INTEGER, 'FM999G999G999') || ' ARS' as precio_promedio_general,
    COUNT(*) as total_habitaciones
FROM habitaciones;
