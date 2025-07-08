-- Limpiar tablas existentes que no necesitamos
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS media CASCADE;

-- Crear tabla de usuarios admin
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de habitaciones (si no existe)
CREATE TABLE IF NOT EXISTS habitaciones (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(10) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    capacidad INTEGER NOT NULL,
    descripcion TEXT,
    amenidades TEXT[],
    estado VARCHAR(20) DEFAULT 'disponible',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de reservas (si no existe)
CREATE TABLE IF NOT EXISTS reservas (
    id SERIAL PRIMARY KEY,
    habitacion_id INTEGER REFERENCES habitaciones(id) ON DELETE CASCADE,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(100) NOT NULL,
    cliente_telefono VARCHAR(20),
    fecha_checkin DATE NOT NULL,
    fecha_checkout DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'confirmada',
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_dates CHECK (fecha_checkout > fecha_checkin)
);

-- Insertar usuario admin por defecto (password: admin123)
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'admin@hotelemaus.com')
ON CONFLICT (username) DO NOTHING;

-- Limpiar datos existentes de habitaciones y reservas para empezar limpio
TRUNCATE TABLE reservas CASCADE;
TRUNCATE TABLE habitaciones CASCADE;

-- Insertar habitaciones de ejemplo
INSERT INTO habitaciones (numero, tipo, precio, capacidad, descripcion, amenidades) VALUES
('101', 'Individual', 80.00, 1, 'Habitación cómoda y acogedora perfecta para viajeros solos', ARRAY['wifi', 'desayuno']),
('102', 'Individual', 85.00, 1, 'Habitación individual con vista a la ciudad', ARRAY['wifi', 'desayuno']),
('103', 'Individual', 80.00, 1, 'Habitación individual estándar', ARRAY['wifi', 'desayuno']),
('201', 'Doble', 120.00, 2, 'Habitación espaciosa con cama matrimonial', ARRAY['wifi', 'desayuno', 'estacionamiento']),
('202', 'Doble', 125.00, 2, 'Habitación doble con balcón privado', ARRAY['wifi', 'desayuno', 'estacionamiento']),
('203', 'Doble', 130.00, 2, 'Habitación premium con vista panorámica', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad']),
('204', 'Doble', 120.00, 2, 'Habitación doble estándar', ARRAY['wifi', 'desayuno', 'estacionamiento']),
('301', 'Suite Familiar', 180.00, 4, 'Amplia suite familiar con sala de estar separada', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad', 'recepcion_24h']),
('302', 'Suite Familiar', 185.00, 4, 'Suite familiar de lujo con todas las amenidades', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad', 'recepcion_24h']),
('401', 'Suite Premium', 250.00, 2, 'Suite de lujo con jacuzzi y vista espectacular', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad', 'recepcion_24h']);

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_habitaciones_estado ON habitaciones(estado);
CREATE INDEX IF NOT EXISTS idx_habitaciones_tipo ON habitaciones(tipo);
CREATE INDEX IF NOT EXISTS idx_reservas_fechas ON reservas(fecha_checkin, fecha_checkout);
CREATE INDEX IF NOT EXISTS idx_reservas_habitacion ON reservas(habitacion_id);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
