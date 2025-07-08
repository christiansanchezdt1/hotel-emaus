-- Insertar reservas de prueba con diferentes estados para testing
-- Limpiar reservas existentes primero
DELETE FROM reservas;

-- Reservas con diferentes estados para probar el modal de eliminación
INSERT INTO reservas (habitacion_id, cliente_nombre, cliente_email, cliente_telefono, fecha_checkin, fecha_checkout, estado, total, created_at) VALUES

-- 1. Reserva CONFIRMADA (se puede eliminar)
(1, 'Ana García López', 'ana.garcia@email.com', '+34612345678', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '4 days', 'confirmada', 160.00, CURRENT_DATE - INTERVAL '1 day'),

-- 2. Reserva CHECK-IN (se puede eliminar)
(2, 'Carlos Rodríguez', 'carlos.rodriguez@email.com', '+34623456789', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '2 days', 'checkin', 255.00, CURRENT_DATE - INTERVAL '2 days'),

-- 3. Reserva CHECK-OUT (NO se puede eliminar)
(3, 'María Fernández', 'maria.fernandez@email.com', '+34634567890', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '3 days', 'checkout', 260.00, CURRENT_DATE - INTERVAL '6 days'),

-- 4. Reserva CANCELADA (se puede eliminar)
(4, 'José Martínez', 'jose.martinez@email.com', '+34645678901', CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', 'cancelada', 240.00, CURRENT_DATE - INTERVAL '3 days'),

-- 5. Reserva CONFIRMADA con nombre largo (se puede eliminar)
(5, 'Isabella Rodríguez-Fernández de la Torre', 'isabella.rodriguez@email.com', '+34656789012', CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '8 days', 'confirmada', 390.00, CURRENT_DATE),

-- 6. Reserva CHECK-IN sin teléfono (se puede eliminar)
(6, 'Pedro Sánchez', 'pedro.sanchez@email.com', NULL, CURRENT_DATE, CURRENT_DATE + INTERVAL '1 day', 'checkin', 180.00, CURRENT_DATE - INTERVAL '1 hour'),

-- 7. Reserva CHECK-OUT reciente (NO se puede eliminar)
(7, 'Laura González', 'laura.gonzalez@email.com', '+34667890123', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '1 day', 'checkout', 85.00, CURRENT_DATE - INTERVAL '3 days'),

-- 8. Reserva CONFIRMADA de larga duración (se puede eliminar)
(8, 'Roberto Silva', 'roberto.silva@email.com', '+34678901234', CURRENT_DATE + INTERVAL '10 days', CURRENT_DATE + INTERVAL '17 days', 'confirmada', 1750.00, CURRENT_DATE - INTERVAL '2 hours'),

-- 9. Reserva CHECK-IN en suite premium (se puede eliminar)
(10, 'Carmen Ruiz', 'carmen.ruiz@email.com', '+34689012345', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', 'checkin', 1000.00, CURRENT_DATE - INTERVAL '2 days'),

-- 10. Reserva CHECK-OUT antigua (NO se puede eliminar)
(1, 'Miguel Torres', 'miguel.torres@email.com', '+34690123456', CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '8 days', 'checkout', 160.00, CURRENT_DATE - INTERVAL '11 days');

-- Verificar los datos insertados
SELECT 
    r.id,
    r.cliente_nombre,
    r.estado,
    r.fecha_checkin,
    r.fecha_checkout,
    r.total,
    h.numero as habitacion,
    h.tipo
FROM reservas r
JOIN habitaciones h ON r.habitacion_id = h.id
ORDER BY r.created_at DESC;
