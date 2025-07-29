-- Script para actualizar el tipo de habitación de "Doble Matrimonial" a "Matrimonial"
-- y verificar que los filtros funcionen correctamente

-- 1. Actualizar habitaciones existentes
UPDATE habitaciones 
SET tipo = 'Matrimonial' 
WHERE tipo = 'Doble Matrimonial';

-- 2. Verificar el cambio
SELECT 
    tipo,
    COUNT(*) as cantidad,
    AVG(precio) as precio_promedio
FROM habitaciones 
GROUP BY tipo 
ORDER BY tipo;

-- 3. Mostrar todas las habitaciones para verificar
SELECT 
    id,
    numero,
    tipo,
    capacidad,
    precio,
    estado,
    descripcion
FROM habitaciones 
ORDER BY numero;

-- 4. Verificar que no hay reservas que interfieran con las pruebas
SELECT 
    r.id,
    r.habitacion_id,
    h.numero,
    h.tipo,
    r.fecha_checkin,
    r.fecha_checkout,
    r.estado
FROM reservas r
JOIN habitaciones h ON r.habitacion_id = h.id
WHERE r.estado IN ('confirmada', 'pendiente')
ORDER BY r.fecha_checkin;

-- 5. Crear algunas reservas de prueba para verificar el filtrado por fechas
-- (Solo ejecutar si no hay datos de prueba)
/*
INSERT INTO reservas (
    habitacion_id,
    nombre_huesped,
    email_huesped,
    telefono_huesped,
    fecha_checkin,
    fecha_checkout,
    precio_total,
    estado,
    created_at
) VALUES 
-- Reserva que ocupa habitación 1 del 2024-02-01 al 2024-02-05
(1, 'Juan Pérez', 'juan@email.com', '123456789', '2024-02-01', '2024-02-05', 15000, 'confirmada', NOW()),
-- Reserva que ocupa habitación 2 del 2024-02-03 al 2024-02-07
(2, 'María García', 'maria@email.com', '987654321', '2024-02-03', '2024-02-07', 20000, 'confirmada', NOW());
*/

-- 6. Consulta para probar el filtrado manual (simula lo que hace la API)
-- Habitaciones disponibles entre 2024-02-02 y 2024-02-04 (debería excluir habitaciones 1 y 2)
SELECT h.*
FROM habitaciones h
WHERE h.estado = 'disponible'
  AND h.id NOT IN (
    SELECT DISTINCT r.habitacion_id
    FROM reservas r
    WHERE r.estado IN ('confirmada', 'pendiente')
      AND r.fecha_checkin <= '2024-02-04'
      AND r.fecha_checkout >= '2024-02-02'
  )
ORDER BY h.numero;
