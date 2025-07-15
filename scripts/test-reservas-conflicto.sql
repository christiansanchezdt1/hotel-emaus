-- Script para probar conflictos de reservas
-- Ejecutar este script para crear datos de prueba y verificar la validación de conflictos

-- Limpiar datos de prueba anteriores
DELETE FROM reservas WHERE cliente_nombre LIKE 'Test%' OR cliente_nombre LIKE 'Cliente Prueba%';

-- Insertar reservas de prueba para verificar conflictos
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
-- Habitación 1: Ocupada del 15 al 20 de enero 2025
(1, 'Test Cliente 1', 'test1@email.com', '+54911111111', '12345678', 'DNI', 'Argentina', '2025-01-15', '2025-01-20', 'confirmada', 150000),

-- Habitación 2: Ocupada del 18 al 25 de enero 2025  
(2, 'Test Cliente 2', 'test2@email.com', '+54922222222', '87654321', 'DNI', 'Argentina', '2025-01-18', '2025-01-25', 'confirmada', 210000),

-- Habitación 3: Ocupada del 10 al 12 de enero 2025
(3, 'Test Cliente 3', 'test3@email.com', '+54933333333', 'ABC123456', 'PASAPORTE', 'Brasil', '2025-01-10', '2025-01-12', 'checkin', 80000),

-- Habitación 1: Segunda reserva del 25 al 30 de enero 2025
(1, 'Test Cliente 4', 'test4@email.com', '+54944444444', '11223344', 'DNI', 'Argentina', '2025-01-25', '2025-01-30', 'confirmada', 125000),

-- Habitación 1: Ocupada del 15 al 20 de enero (confirmada)
(
  (SELECT id FROM habitaciones WHERE numero = '101' LIMIT 1),
  'Cliente Prueba 1',
  'cliente1@test.com',
  '+54 387 123-4567',
  '12345678',
  'DNI',
  'Argentina',
  '2025-01-15',
  '2025-01-20',
  150000,
  'confirmada',
  NOW()
),

-- Habitación 1: Ocupada del 25 al 30 de enero (checkin)
(
  (SELECT id FROM habitaciones WHERE numero = '101' LIMIT 1),
  'Cliente Prueba 2',
  'cliente2@test.com',
  '+54 387 234-5678',
  '87654321',
  'DNI',
  'Argentina',
  '2025-01-25',
  '2025-01-30',
  175000,
  'checkin',
  NOW()
),

-- Habitación 2: Ocupada del 18 al 25 de enero (confirmada)
(
  (SELECT id FROM habitaciones WHERE numero = '102' LIMIT 1),
  'Cliente Prueba 3',
  'cliente3@test.com',
  '+54 387 345-6789',
  '11223344',
  'DNI',
  'Chile',
  '2025-01-18',
  '2025-01-25',
  200000,
  'confirmada',
  NOW()
),

-- Habitación 3: Ocupada del 10 al 12 de enero (checkin)
(
  (SELECT id FROM habitaciones WHERE numero = '103' LIMIT 1),
  'Cliente Prueba 4',
  'cliente4@test.com',
  '+54 387 456-7890',
  '55667788',
  'Pasaporte',
  'Brasil',
  '2025-01-10',
  '2025-01-12',
  120000,
  'checkin',
  NOW()
),

-- Habitación 4: Reserva cancelada (no debe bloquear)
(
  (SELECT id FROM habitaciones WHERE numero = '104' LIMIT 1),
  'Cliente Prueba 5',
  'cliente5@test.com',
  '+54 387 567-8901',
  '99887766',
  'DNI',
  'Argentina',
  '2025-01-16',
  '2025-01-22',
  180000,
  'cancelada',
  NOW()
),

-- Habitación 5: Reserva con checkout (no debe bloquear)
(
  (SELECT id FROM habitaciones WHERE numero = '105' LIMIT 1),
  'Cliente Prueba 6',
  'cliente6@test.com',
  '+54 387 678-9012',
  '44556677',
  'DNI',
  'Uruguay',
  '2025-01-05',
  '2025-01-08',
  140000,
  'checkout',
  NOW()
);

-- Verificar las reservas insertadas
SELECT 
  r.id,
  r.habitacion_id,
  h.numero as habitacion_numero,
  h.tipo as habitacion_tipo,
  r.cliente_nombre,
  r.fecha_checkin,
  r.fecha_checkout,
  r.estado,
  r.total
FROM reservas r
JOIN habitaciones h ON r.habitacion_id = h.id
WHERE r.cliente_nombre LIKE 'Test%' OR r.cliente_nombre LIKE 'Cliente Prueba%'
ORDER BY r.habitacion_id, r.fecha_checkin;

-- Mostrar conflictos potenciales para fechas específicas
-- Ejemplo: Intentar reservar del 16 al 22 de enero (debería mostrar conflictos)
SELECT 
  'CONFLICTO DETECTADO' as tipo,
  h.numero as habitacion,
  h.tipo,
  r.cliente_nombre,
  r.fecha_checkin,
  r.fecha_checkout,
  r.estado,
  'Solicitado: 2025-01-16 a 2025-01-22' as fechas_solicitadas
FROM reservas r
JOIN habitaciones h ON r.habitacion_id = h.id
WHERE r.estado IN ('confirmada', 'checkin')
  AND (
    (r.fecha_checkin <= '2025-01-16' AND r.fecha_checkout > '2025-01-16') OR
    (r.fecha_checkin < '2025-01-22' AND r.fecha_checkout >= '2025-01-22') OR
    (r.fecha_checkin >= '2025-01-16' AND r.fecha_checkout <= '2025-01-22')
  )
ORDER BY h.numero;

-- Mostrar habitaciones disponibles para fechas específicas
-- Ejemplo: Habitaciones libres del 16 al 22 de enero
SELECT 
  h.id,
  h.numero,
  h.tipo,
  h.precio,
  h.capacidad,
  'DISPONIBLE del 16 al 22 de enero' as estado
FROM habitaciones h
WHERE h.estado = 'disponible'
  AND h.id NOT IN (
    SELECT DISTINCT r.habitacion_id
    FROM reservas r
    WHERE r.estado IN ('confirmada', 'checkin')
      AND (
        (r.fecha_checkin <= '2025-01-16' AND r.fecha_checkout > '2025-01-16') OR
        (r.fecha_checkin < '2025-01-22' AND r.fecha_checkout >= '2025-01-22') OR
        (r.fecha_checkin >= '2025-01-16' AND r.fecha_checkout <= '2025-01-22')
      )
  )
ORDER BY h.numero;

-- Resumen de ocupación por habitación
SELECT 
  h.numero as habitacion,
  h.tipo,
  COUNT(r.id) as total_reservas,
  MIN(r.fecha_checkin) as primera_reserva,
  MAX(r.fecha_checkout) as ultima_reserva
FROM habitaciones h
LEFT JOIN reservas r ON h.id = r.habitacion_id 
  AND r.estado IN ('confirmada', 'checkin')
  AND r.cliente_nombre LIKE 'Test%'
GROUP BY h.id, h.numero, h.tipo
ORDER BY h.numero;

-- Consulta para verificar disponibilidad en un rango específico
-- Ejemplo: Verificar disponibilidad del 16 al 22 de enero
SELECT 
  h.id,
  h.numero,
  h.tipo,
  h.precio,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM reservas r 
      WHERE r.habitacion_id = h.id 
      AND r.estado IN ('confirmada', 'checkin')
      AND (
        (r.fecha_checkin <= '2025-01-16' AND r.fecha_checkout > '2025-01-16') OR
        (r.fecha_checkin < '2025-01-22' AND r.fecha_checkout >= '2025-01-22') OR
        (r.fecha_checkin >= '2025-01-16' AND r.fecha_checkout <= '2025-01-22')
      )
    ) THEN 'OCUPADA'
    ELSE 'DISPONIBLE'
  END as disponibilidad
FROM habitaciones h
WHERE h.disponible = true
ORDER BY h.numero;

-- Consulta para ver qué reservas causan conflicto en un rango específico
SELECT 
  h.numero as habitacion,
  r.cliente_nombre,
  r.fecha_checkin,
  r.fecha_checkout,
  r.estado,
  'Conflicto con 16-22 enero' as motivo
FROM reservas r
JOIN habitaciones h ON r.habitacion_id = h.id
WHERE r.estado IN ('confirmada', 'checkin')
AND (
  (r.fecha_checkin <= '2025-01-16' AND r.fecha_checkout > '2025-01-16') OR
  (r.fecha_checkin < '2025-01-22' AND r.fecha_checkout >= '2025-01-22') OR
  (r.fecha_checkin >= '2025-01-16' AND r.fecha_checkout <= '2025-01-22')
)
ORDER BY h.numero;

-- Análisis de ocupación por habitación
SELECT 
  h.numero as habitacion,
  h.tipo,
  COUNT(r.id) as total_reservas,
  COUNT(CASE WHEN r.estado = 'confirmada' THEN 1 END) as confirmadas,
  COUNT(CASE WHEN r.estado = 'checkin' THEN 1 END) as checkin,
  COUNT(CASE WHEN r.estado = 'checkout' THEN 1 END) as checkout,
  COUNT(CASE WHEN r.estado = 'cancelada' THEN 1 END) as canceladas
FROM habitaciones h
LEFT JOIN reservas r ON h.id = r.habitacion_id
WHERE h.disponible = true
GROUP BY h.id, h.numero, h.tipo
ORDER BY h.numero;
