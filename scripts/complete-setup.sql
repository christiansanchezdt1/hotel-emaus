-- ============================================
-- SCRIPT COMPLETO DE CONFIGURACIÓN
-- Hotel Emaús - Base de datos
-- ============================================

-- Eliminar tablas existentes si existen (en orden correcto por dependencias)
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS habitaciones CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- ============================================
-- CREAR TABLA DE USUARIOS ADMIN
-- ============================================
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREAR TABLA DE HABITACIONES
-- ============================================
CREATE TABLE habitaciones (
    id SERIAL PRIMARY KEY,
    numero VARCHAR(10) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    capacidad INTEGER NOT NULL,
    descripcion TEXT,
    amenidades TEXT[],
    estado VARCHAR(20) DEFAULT 'disponible' CHECK (estado IN ('disponible', 'ocupada', 'mantenimiento', 'fuera_servicio')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CREAR TABLA DE RESERVAS
-- ============================================
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    habitacion_id INTEGER NOT NULL REFERENCES habitaciones(id) ON DELETE CASCADE,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(100) NOT NULL,
    cliente_telefono VARCHAR(20),
    fecha_checkin DATE NOT NULL,
    fecha_checkout DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'confirmada' CHECK (estado IN ('confirmada', 'checkin', 'checkout', 'cancelada')),
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint para evitar fechas inválidas
    CONSTRAINT valid_dates CHECK (fecha_checkout > fecha_checkin)
);

-- ============================================
-- INSERTAR USUARIO ADMIN
-- ============================================
INSERT INTO admin_users (username, password, email) VALUES
('admin', 'admin123', 'admin@hotelemaus.com');

-- ============================================
-- INSERTAR HABITACIONES DE EJEMPLO
-- ============================================
INSERT INTO habitaciones (numero, tipo, precio, capacidad, descripcion, amenidades, estado) VALUES
-- Habitaciones Individuales
('101', 'Individual', 80.00, 1, 'Habitación cómoda y acogedora perfecta para viajeros solos', ARRAY['wifi', 'desayuno'], 'disponible'),
('102', 'Individual', 85.00, 1, 'Habitación individual con vista a la ciudad', ARRAY['wifi', 'desayuno'], 'disponible'),
('103', 'Individual', 80.00, 1, 'Habitación individual estándar con todas las comodidades', ARRAY['wifi', 'desayuno'], 'disponible'),

-- Habitaciones Dobles
('201', 'Doble', 120.00, 2, 'Habitación espaciosa con cama matrimonial y balcón', ARRAY['wifi', 'desayuno', 'estacionamiento'], 'disponible'),
('202', 'Doble', 125.00, 2, 'Habitación doble con vista panorámica de la ciudad', ARRAY['wifi', 'desayuno', 'estacionamiento'], 'disponible'),
('203', 'Doble', 130.00, 2, 'Habitación premium con amenidades de lujo', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad'], 'disponible'),
('204', 'Doble', 120.00, 2, 'Habitación doble estándar muy confortable', ARRAY['wifi', 'desayuno', 'estacionamiento'], 'disponible'),

-- Suites Familiares
('301', 'Suite Familiar', 180.00, 4, 'Amplia suite familiar con sala de estar separada y dos habitaciones', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad', 'recepcion_24h'], 'disponible'),
('302', 'Suite Familiar', 185.00, 4, 'Suite familiar de lujo con todas las amenidades premium', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad', 'recepcion_24h'], 'disponible'),

-- Suite Premium
('401', 'Suite Premium', 250.00, 2, 'Suite de lujo con jacuzzi, vista espectacular y servicio VIP', ARRAY['wifi', 'desayuno', 'estacionamiento', 'seguridad', 'recepcion_24h'], 'disponible');

-- ============================================
-- INSERTAR ALGUNAS RESERVAS DE EJEMPLO
-- ============================================
INSERT INTO reservas (habitacion_id, cliente_nombre, cliente_email, cliente_telefono, fecha_checkin, fecha_checkout, estado, total) VALUES
-- Reserva activa (ocupando habitación 101)
(1, 'Juan Pérez', 'juan.perez@email.com', '+1234567890', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '2 days', 'checkin', 240.00),

-- Reserva futura
(3, 'María García', 'maria.garcia@email.com', '+1234567891', CURRENT_DATE + INTERVAL '3 days', CURRENT_DATE + INTERVAL '5 days', 'confirmada', 260.00),

-- Reserva pasada
(2, 'Carlos López', 'carlos.lopez@email.com', '+1234567892', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '3 days', 'checkout', 170.00);

-- ============================================
-- CREAR ÍNDICES PARA MEJORAR PERFORMANCE
-- ============================================
CREATE INDEX idx_habitaciones_estado ON habitaciones(estado);
CREATE INDEX idx_habitaciones_tipo ON habitaciones(tipo);
CREATE INDEX idx_habitaciones_numero ON habitaciones(numero);

CREATE INDEX idx_reservas_fechas ON reservas(fecha_checkin, fecha_checkout);
CREATE INDEX idx_reservas_habitacion ON reservas(habitacion_id);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_reservas_cliente_email ON reservas(cliente_email);

CREATE INDEX idx_admin_users_username ON admin_users(username);

-- ============================================
-- VERIFICAR QUE TODO SE CREÓ CORRECTAMENTE
-- ============================================

-- Mostrar tablas creadas
SELECT 'TABLAS CREADAS:' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Mostrar usuarios admin
SELECT 'USUARIOS ADMIN:' as info;
SELECT id, username, email, created_at FROM admin_users;

-- Mostrar habitaciones
SELECT 'HABITACIONES:' as info;
SELECT id, numero, tipo, precio, capacidad, estado FROM habitaciones ORDER BY numero;

-- Mostrar reservas
SELECT 'RESERVAS:' as info;
SELECT id, habitacion_id, cliente_nombre, fecha_checkin, fecha_checkout, estado, total FROM reservas ORDER BY created_at DESC;

-- Mostrar estadísticas
SELECT 'ESTADÍSTICAS:' as info;
SELECT 
    (SELECT COUNT(*) FROM habitaciones) as total_habitaciones,
    (SELECT COUNT(*) FROM habitaciones WHERE estado = 'disponible') as habitaciones_disponibles,
    (SELECT COUNT(*) FROM reservas) as total_reservas,
    (SELECT COUNT(*) FROM reservas WHERE estado IN ('confirmada', 'checkin')) as reservas_activas;
