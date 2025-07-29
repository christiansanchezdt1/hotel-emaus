-- Actualizar tipos de habitaciones existentes y agregar nuevas habitaciones de ejemplo

-- Primero, actualizar las habitaciones existentes para tener tipos más específicos
UPDATE habitaciones 
SET tipo = 'Individual', 
    descripcion = 'Habitación individual con cama simple, ideal para una persona. Incluye baño privado, ventilador de techo y calefacción.',
    amenidades = ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Ropa de cama', 'Toallas']
WHERE capacidad = 1 AND tipo IN ('Simple', 'Económica', 'Básica');

UPDATE habitaciones 
SET tipo = 'Doble', 
    descripcion = 'Habitación doble con dos camas individuales, perfecta para amigos o familiares. Incluye baño privado, ventilador de techo y calefacción.',
    amenidades = ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Dos camas individuales', 'Ropa de cama', 'Toallas']
WHERE capacidad = 2 AND tipo IN ('Doble', 'Estándar') AND numero NOT IN ('106', '107', '206', '207');

UPDATE habitaciones 
SET tipo = 'Doble Matrimonial', 
    descripcion = 'Habitación matrimonial con cama doble, ideal para parejas. Incluye baño privado, ventilador de techo y calefacción.',
    amenidades = ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Cama matrimonial', 'Ropa de cama', 'Toallas']
WHERE numero IN ('106', '107', '206', '207') OR (capacidad = 2 AND tipo ILIKE '%matrimonial%');

-- Insertar habitaciones de ejemplo si no existen
INSERT INTO habitaciones (numero, tipo, precio, capacidad, descripcion, amenidades, estado)
SELECT * FROM (VALUES
  ('101', 'Individual', 15000, 1, 'Habitación individual con cama simple, ideal para una persona. Incluye baño privado, ventilador de techo y calefacción.', ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Ropa de cama', 'Toallas'], 'disponible'),
  ('102', 'Individual', 15000, 1, 'Habitación individual con cama simple, ideal para una persona. Incluye baño privado, ventilador de techo y calefacción.', ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Ropa de cama', 'Toallas'], 'disponible'),
  ('103', 'Doble', 25000, 2, 'Habitación doble con dos camas individuales, perfecta para amigos o familiares. Incluye baño privado, ventilador de techo y calefacción.', ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Dos camas individuales', 'Ropa de cama', 'Toallas'], 'disponible'),
  ('104', 'Doble', 25000, 2, 'Habitación doble con dos camas individuales, perfecta para amigos o familiares. Incluye baño privado, ventilador de techo y calefacción.', ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Dos camas individuales', 'Ropa de cama', 'Toallas'], 'disponible'),
  ('105', 'Doble', 25000, 2, 'Habitación doble con dos camas individuales, perfecta para amigos o familiares. Incluye baño privado, ventilador de techo y calefacción.', ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Dos camas individuales', 'Ropa de cama', 'Toallas'], 'disponible'),
  ('106', 'Doble Matrimonial', 28000, 2, 'Habitación matrimonial con cama doble, ideal para parejas. Incluye baño privado, ventilador de techo y calefacción.', ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Cama matrimonial', 'Ropa de cama', 'Toallas'], 'disponible'),
  ('107', 'Doble Matrimonial', 28000, 2, 'Habitación matrimonial con cama doble, ideal para parejas. Incluye baño privado, ventilador de techo y calefacción.', ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Cama matrimonial', 'Ropa de cama', 'Toallas'], 'disponible'),
  ('201', 'Individual', 16000, 1, 'Habitación individual en primer piso con cama simple, ideal para una persona. Incluye baño privado, ventilador de techo y calefacción.', ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Ropa de cama', 'Toallas'], 'disponible'),
  ('202', 'Individual', 16000, 1, 'Habitación individual en primer piso con cama simple, ideal para una persona. Incluye baño privado, ventilador de techo y calefacción.', ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Ropa de cama', 'Toallas'], 'disponible'),
  ('203', 'Doble', 26000, 2, 'Habitación doble en primer piso con dos camas individuales, perfecta para amigos o familiares. Incluye baño privado, ventilador de techo y calefacción.', ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Dos camas individuales', 'Ropa de cama', 'Toallas'], 'disponible'),
  ('204', 'Doble', 26000, 2, 'Habitación doble en primer piso con dos camas individuales, perfecta para amigos o familiares. Incluye baño privado, ventilador de techo y calefacción.', ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Dos camas individuales', 'Ropa de cama', 'Toallas'], 'disponible'),
  ('205', 'Doble', 26000, 2, 'Habitación doble en primer piso con dos camas individuales, perfecta para amigos o familiares. Incluye baño privado, ventilador de techo y calefacción.', ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Dos camas individuales', 'Ropa de cama', 'Toallas'], 'disponible'),
  ('206', 'Doble Matrimonial', 29000, 2, 'Habitación matrimonial en primer piso con cama doble, ideal para parejas. Incluye baño privado, ventilador de techo y calefacción.', ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Cama matrimonial', 'Ropa de cama', 'Toallas'], 'disponible'),
  ('207', 'Doble Matrimonial', 29000, 2, 'Habitación matrimonial en primer piso con cama doble, ideal para parejas. Incluye baño privado, ventilador de techo y calefacción.', ARRAY['WiFi', 'Baño privado', 'Ventilador de techo', 'Calefacción', 'Cama matrimonial', 'Ropa de cama', 'Toallas'], 'disponible')
) AS nuevas_habitaciones(numero, tipo, precio, capacidad, descripcion, amenidades, estado)
WHERE NOT EXISTS (
  SELECT 1 FROM habitaciones WHERE numero = nuevas_habitaciones.numero
);

-- Verificar los resultados
SELECT numero, tipo, precio, capacidad, descripcion 
FROM habitaciones 
ORDER BY numero;
