-- Insertar administrador por defecto (password: admin123)
INSERT INTO admins (email, password_hash, name) VALUES 
('admin@hotelemaus.com', '$2b$10$rQZ9QmjKjKjKjKjKjKjKjOeJ9QmjKjKjKjKjKjKjKjKjKjKjKjKjK', 'Administrador Hotel')
ON CONFLICT (email) DO NOTHING;

-- Insertar habitaciones de ejemplo
INSERT INTO rooms (name, description, price, capacity, size, amenities, image_url, is_available) VALUES 
(
  'Habitación Estándar',
  'Cómoda habitación con todas las comodidades básicas',
  89.00,
  2,
  '25 m²',
  ARRAY['Wifi gratuito', 'TV por cable', 'Aire acondicionado', 'Baño privado'],
  '/placeholder.svg?height=300&width=400',
  true
),
(
  'Habitación Deluxe',
  'Habitación espaciosa con vista al mar y balcón privado',
  129.00,
  3,
  '35 m²',
  ARRAY['Wifi gratuito', 'TV Smart', 'Minibar', 'Balcón con vista al mar', 'Bañera'],
  '/placeholder.svg?height=300&width=400',
  true
),
(
  'Suite Presidencial',
  'Lujosa suite con sala de estar separada y jacuzzi',
  249.00,
  4,
  '65 m²',
  ARRAY['Wifi gratuito', 'TV Smart 55"', 'Minibar premium', 'Jacuzzi', 'Sala de estar', 'Servicio de habitación 24h'],
  '/placeholder.svg?height=300&width=400',
  true
)
ON CONFLICT DO NOTHING;
