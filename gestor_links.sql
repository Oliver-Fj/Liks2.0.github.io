-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS gestor_links;

-- Usar la base de datos
USE gestor_links;

-- Crear la tabla de semanas
CREATE TABLE IF NOT EXISTS weeks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(10) NOT NULL,
    is_collapsed BOOLEAN DEFAULT FALSE
);

-- Crear la tabla de links
CREATE TABLE IF NOT EXISTS links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    week_id INT,
    FOREIGN KEY (week_id) REFERENCES weeks(id) ON DELETE CASCADE
);

-- Insertar algunas semanas de ejemplo
INSERT INTO weeks (name, is_collapsed) VALUES
('Semana 1', FALSE),
('Semana 2', TRUE),
('Semana 3', TRUE);

-- Insertar algunos links de ejemplo
INSERT INTO links (title, url, week_id) VALUES
('Documentación de PHP', 'https://www.php.net/docs.php', 1),
('Tutorial de MySQL', 'https://dev.mysql.com/doc/refman/8.0/en/', 1),
('Railway Documentation', 'https://docs.railway.app/', 2);