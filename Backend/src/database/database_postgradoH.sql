CREATE DATABASE postgrado_historia;

USE postgrado_historia; 

CREATE TABLE rol (
    rol_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
INSERT INTO rol (nombre) VALUES ('Admin'),('Secretaria'),('Academico');
SELECT * FROM rol;

CREATE TABLE rol_academico (
    rolaca_id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_academico VARCHAR(100) NOT NULL UNIQUE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
INSERT INTO rol_academico (tipo_academico) VALUES ('Claustro'),('Colaborador');
SELECT * FROM rol_academico;

CREATE TABLE usuario(
	usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    rut VARCHAR(15) UNIQUE NOT NULL,
    primer_nombre VARCHAR(100) NOT NULL,
    segundo_nombre VARCHAR(100),
    primer_apellido VARCHAR(100) NOT NULL,
    segundo_apellido VARCHAR(100),
    correo VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    lineas_investigacion VARCHAR(100) NOT NULL, -- ??
    rol_id INT NOT NULL,
    rolaca_id INT NULL,
    FOREIGN KEY (rol_id) REFERENCES rol(rol_id),
    FOREIGN KEY (rolaca_id) REFERENCES rol_academico(rolaca_id)
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
ALTER TABLE usuario
ADD COLUMN telefono VARCHAR(20) AFTER correo;
ALTER TABLE usuario
MODIFY COLUMN lineas_investigacion TEXT;
ALTER TABLE usuario DROP COLUMN correo;
ALTER TABLE usuario
ADD COLUMN ano_ingreso YEAR AFTER segundo_apellido;
SELECT * FROM usuario;

CREATE TABLE mail(
	mail_id INT AUTO_INCREMENT PRIMARY KEY,
    mail VARCHAR(150) UNIQUE NOT NULL,
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
    ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
SELECT * FROM mail;

-- drop table grado_academico;
CREATE TABLE grado_academico (
    grado_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre_grado VARCHAR(100) NOT NULL, 
    institucion_grado VARCHAR(200),
    pais_grado VARCHAR(100),
    ano_grado YEAR,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
        ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
SELECT * FROM grado_academico;

CREATE TABLE titulacion (
    titulo_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    institucion_titulacion VARCHAR(200),
    pais_titulacion VARCHAR(100),
    ano_titulacion YEAR,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
        ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
SELECT * FROM titulacion;

CREATE TABLE publicaciones (
    publicacion_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_id INT NOT NULL,
    titulo_articulo VARCHAR(300) NOT NULL,
    nombre_revista VARCHAR(200),
    ISSN VARCHAR(50),
    ano YEAR,
    autor_principal VARCHAR(200),
    autores TEXT,
    link_verificacion TEXT,
    estado VARCHAR(100),
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
        ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categoria(categoria_id)
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
SELECT * FROM publicaciones;

CREATE TABLE categoria (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
INSERT INTO categoria (nombre) VALUES ('WoS'),('SCOPUS'),('SCIELO'),('LATINDEX'),('ERIH'),('Otros.');
SELECT * FROM categoria;

CREATE TABLE libro (
    libro_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre_libro VARCHAR(300) NOT NULL,
    editorial VARCHAR(200),
    lugar VARCHAR(200),
    ano YEAR,
    autor_principal VARCHAR(200),
	autores TEXT,
    link_verificacion TEXT,
    estado VARCHAR(100),
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
        ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
SELECT * FROM libro;

CREATE TABLE cap_libro (
    cap_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre_capitulo VARCHAR(300) NOT NULL,
    nombre_libro VARCHAR(300),
    editorial VARCHAR(200),
    lugar VARCHAR(200),
    ano YEAR,
    autor_principal VARCHAR(200),
    autores TEXT,
    link_verificacion TEXT,
    estado VARCHAR(100),
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
        ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tesis (
    tesis_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo_tesis VARCHAR(300) NOT NULL,
    nombre_programa VARCHAR(200),
    institucion VARCHAR(200),
    ano YEAR,
    autor VARCHAR(200),
    link_verificacion TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
        ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
ALTER TABLE tesis
	ADD COLUMN tesis_dirigida ENUM('Si', 'No') AFTER institucion;
SELECT * FROM tesis;

-- drop table investigacion;
CREATE TABLE investigacion (
    investigacion_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(300) NOT NULL,
    fuente_financiamiento VARCHAR(200),
    ano_adjudicacion YEAR,
    periodo_ejecucion VARCHAR(100),
    rol_proyecto VARCHAR(100),
    link_verificacion TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
        ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
SELECT * FROM investigacion;

-- drop table patente;
CREATE TABLE patente (
    patente_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    inventores TEXT,
    nombre_patente VARCHAR(300),
    num_registro VARCHAR(100),
    fecha_solicitud DATE,
    fecha_publicacion DATE,
    estado VARCHAR(100),
    link_verificacion TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
        ON DELETE CASCADE

)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;
SELECT * FROM patente;