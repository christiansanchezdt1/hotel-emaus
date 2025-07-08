-- Crear tabla de habitaciones
CREATE TABLE IF NOT EXISTS habitaciones (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(10) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    capacidad INTEGER NOT NULL,
    descripcion TEXT,
    amenidades TEXT[], -- Array de amenidades
    estado VARCHAR(20) DEFAULT 'disponible', -- disponible, mantenimiento, fuera_servicio
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    habitacion_id INTEGER REFERENCES habitaciones(id),
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(100) NOT NULL,
    cliente_telefono VARCHAR(20),
    fecha_checkin DATE NOT NULL,
    fecha_checkout DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'confirmada', -- confirmada, checkin, checkout, cancelada
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint para evitar fechas inválidas
    CONSTRAINT valid_dates CHECK (fecha_checkout > fecha_checkin)
);

-- Insertar habitaciones de ejemplo
INSERT INTO habitaciones (numero, tipo, precio, capacidad, descripcion, amenidades) VALUES
('101', 'Individual', 80.00, 1, 'Habitación cómoda y acogedora perfecta para viajeros solos', ARRAY['wifi', 'desayuno']),
('102', 'Individual', 80.00, 1, 'Habitación individual con vista a la ciudad', ARRAY['wifi', 'desayuno']),
('201', 'Doble', 120.00, 2, 'Habitación espaciosa con cama matrimonial y todas las comodidades', ARRAY['wifi', 'desayuno', 'estacionamiento']),
('202', 'Doble', 120.00, 2, 'Habitación doble con balcón privado', ARRAY['wifi', 'desayuno', 'estacionamiento']),
('203', 'Doble', 125.00, 2, 'Habitación premium con vista panorámica', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad']),
('301', 'Suite Familiar', 180.00, 4, 'Amplia suite familiar con sala de estar separada', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad', 'recepcion_24h']),
('302', 'Suite Familiar', 180.00, 4, 'Suite familiar de lujo con todas las amenidades', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad', 'recepcion_24h']),
('401', 'Suite Premium', 250.00, 2, 'Suite de lujo con jacuzzi y vista espectacular', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad', 'recepcion_24h']);

-- Insertar algunas reservas de ejemplo (algunas activas, otras pasadas)
INSERT INTO reservas (habitacion_id, cliente_nombre, cliente_email, fecha_checkin, fecha_checkout, total, estado) VALUES
(1, 'Juan Pérez', 'juan@email.com', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '1 day', 240.00, 'checkin'),
(3, 'María García', 'maria@email.com', CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', 240.00, 'confirmada'),
(6, 'Carlos López', 'carlos@email.com', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '2 days', 540.00, 'checkin');

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_habitaciones_estado ON habitaciones(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_fechas ON reservas(fecha_checkin, fecha_checkout);
CREATE INDEX IF NOT EXISTS idx_reservas_habitacion ON reservas(habitacion_id);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);
