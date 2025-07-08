-- Crear tabla de usuarios admin si no existe
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eliminar usuario admin existente si existe
DELETE FROM admin_users WHERE username = 'admin';

-- Insertar usuario admin con contraseña simple
INSERT INTO admin_users (username, password, email) VALUES
('admin', 'admin123', 'admin@hotelemaus.com');

-- Verificar que se insertó correctamente
SELECT * FROM admin_users WHERE username = 'admin';
