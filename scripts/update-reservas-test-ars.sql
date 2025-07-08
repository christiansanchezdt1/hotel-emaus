-- Actualizar las reservas de prueba con totales en pesos argentinos
-- Basado en los nuevos precios de habitaciones

-- Limpiar reservas existentes
DELETE FROM reservas;

-- Insertar reservas de prueba con totales en ARS
INSERT INTO reservas (habitacion_id, cliente_nombre, cliente_email, cliente_telefono, fecha_checkin, fecha_checkout, estado, total, created_at) VALUES

-- 1. Reserva CONFIRMADA (se puede eliminar) - Habitación Individual $25,000 x 2 noches
(1, 'Ana García López', 'ana.garcia@email.com', '+54911234567', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '4 days', 'confirmada', 50000, CURRENT_DATE - INTERVAL '1 day'),

-- 2. Reserva CHECK-IN (se puede eliminar) - Habitación Individual $28,000 x 3 noches  
(2, 'Carlos Rodríguez', 'carlos.rodriguez@email.com', '+54911234568', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '2 days', 'checkin', 84000, CURRENT_DATE - INTERVAL '2 days'),

-- 3. Reserva CHECK-OUT (NO se puede eliminar) - Habitación Individual $30,000 x 2 noches
(3, 'María Fernández', 'maria.fernandez@email.com', '+54911234569', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '3 days', 'checkout', 60000, CURRENT_DATE - INTERVAL '6 days'),

-- 4. Reserva CANCELADA (se puede eliminar) - Habitación Doble $45,000 x 2 noches
(4, 'José Martínez', 'jose.martinez@email.com', '+54911234570', CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', 'cancelada', 90000, CURRENT_DATE - INTERVAL '3 days'),

-- 5. Reserva CONFIRMADA con nombre largo - Habitación Doble $48,000 x 3 noches
(5, 'Isabella Rodríguez-Fernández de la Torre', 'isabella.rodriguez@email.com', '+54911234571', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '8 days', 'confirmada', 144000, CURRENT_DATE),

-- 6. Reserva CHECK-IN sin teléfono - Suite Familiar $75,000 x 1 noche
(6, 'Pedro Sánchez', 'pedro.sanchez@email.com', NULL, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day', 'checkin', 75000, CURRENT_DATE - INTERVAL '1 hour'),

-- 7. Reserva CHECK-OUT reciente (NO se puede eliminar) - Suite Familiar $78,000 x 1 noche
(7, 'Laura González', 'laura.gonzalez@email.com', '+54911234572', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '1 day', 'checkout', 78000, CURRENT_DATE - INTERVAL '3 days'),

-- 8. Reserva CONFIRMADA de larga duración - Suite Premium $120,000 x 7 noches
(8, 'Roberto Silva', 'roberto.silva@email.com', '+54911234573', CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '17 days', 'confirmada', 840000, CURRENT_DATE - INTERVAL '2 hours'),

-- 9. Reserva CHECK-IN en suite premium - Suite Premium $120,000 x 4 noches
(10, 'Carmen Ruiz', 'carmen.ruiz@email.com', '+54911234574', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', 'checkin', 480000, CURRENT_DATE - INTERVAL '2 days'),

-- 10. Reserva CHECK-OUT antigua (NO se puede eliminar) - Habitación Individual $25,000 x 2 noches
(1, 'Miguel Torres', 'miguel.torres@email.com', '+54911234575', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '8 days', 'checkout', 50000, CURRENT_DATE - INTERVAL '11 days');

-- Verificar los datos con precios en ARS
SELECT 
    r.id,
    r.cliente_nombre,
    r.estado,
    r.fecha_checkin,
    r.fecha_checkout,
    '$' || FORMAT(r.total, 'FM999G999G999') || ' ARS' as total_formateado,
    h.numero as habitacion,
    h.tipo,
    '$' || FORMAT(h.precio, 'FM999G999G999') || ' ARS' as precio_por_noche
FROM reservas r
JOIN habitaciones h ON r.habitacion_id = h.id
ORDER BY r.created_at DESC;

-- Mostrar estadísticas de ingresos en ARS
SELECT 
    'ESTADÍSTICAS DE INGRESOS (ARS)' as info,
    COUNT(*) as total_reservas,
    '$' || FORMAT(SUM(total), 'FM999G999G999') || ' ARS' as ingresos_totales,
    '$' || FORMAT(AVG(total)::INTEGER, 'FM999G999G999') || ' ARS' as promedio_por_reserva,
    '$' || FORMAT(MIN(total), 'FM999G999G999') || ' ARS' as reserva_minima,
    '$' || FORMAT(MAX(total), 'FM999G999G999') || ' ARS' as reserva_maxima
FROM reservas;
