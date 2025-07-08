-- Insertar habitaciones adicionales para probar eliminación
-- Estas habitaciones NO tendrán reservas, por lo que se podrán eliminar

INSERT INTO habitaciones (numero, tipo, precio, capacidad, descripcion, amenidades, estado) VALUES

-- Habitaciones que se pueden eliminar (sin reservas)
('105', 'Individual', 75.00, 1, 'Habitación individual básica para pruebas de eliminación', ARRAY['wifi'], 'disponible'),
('106', 'Individual', 90.00, 1, 'Habitación individual premium para pruebas', ARRAY['wifi', 'desayuno'], 'disponible'),
('205', 'Doble', 110.00, 2, 'Habitación doble económica para pruebas', ARRAY['wifi', 'estacionamiento'], 'disponible'),
('206', 'Doble', 140.00, 2, 'Habitación doble con vista para pruebas', ARRAY['wifi', 'desayuno', 'estacionamiento'], 'disponible'),
('303', 'Suite Familiar', 200.00, 4, 'Suite familiar para pruebas de eliminación', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad'], 'disponible'),

-- Habitaciones en mantenimiento (no se pueden eliminar por estado)
('107', 'Individual', 80.00, 1, 'Habitación en mantenimiento - no eliminable', ARRAY['wifi'], 'mantenimiento'),
('207', 'Doble', 120.00, 2, 'Habitación en mantenimiento - no eliminable', ARRAY['wifi', 'estacionamiento'], 'mantenimiento'),

-- Habitación fuera de servicio (no se puede eliminar por estado)
('108', 'Individual', 85.00, 1, 'Habitación fuera de servicio - no eliminable', ARRAY['wifi'], 'fuera_servicio');

-- Verificar las habitaciones insertadas
SELECT 
    h.id,
    h.numero,
    h.tipo,
    h.precio,
    h.estado,
    COUNT(r.id) as reservas_activas
FROM habitaciones h
LEFT JOIN reservas r ON h.id = r.habitacion_id AND r.estado IN ('confirmada', 'checkin')
GROUP BY h.id, h.numero, h.tipo, h.precio, h.estado
ORDER BY h.numero;

-- Mostrar estadísticas
SELECT 
    'ESTADÍSTICAS DE HABITACIONES' as info,
    COUNT(*) as total_habitaciones,
    COUNT(CASE WHEN estado = 'disponible' THEN 1 END) as disponibles,
    COUNT(CASE WHEN estado = 'mantenimiento' THEN 1 END) as mantenimiento,
    COUNT(CASE WHEN estado = 'fuera_servicio' THEN 1 END) as fuera_servicio
FROM habitaciones;
