CREATE DATABASE postgrado_historia;

USE postgrado_historia; 

CREATE TABLE rol (
    rol_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rol_academico (
    rolaca_id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_academico VARCHAR(100) NOT NULL UNIQUE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE grado_academico (
    grado_id INT AUTO_INCREMENT PRIMARY KEY,
    grado_academico VARCHAR(100) NOT NULL 
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE titulacion (
    titulo_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    grado_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    institucion VARCHAR(200),
    pais VARCHAR(100),
    ano_titulacion YEAR,
    
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
        ON DELETE CASCADE,
    FOREIGN KEY (grado_id) REFERENCES grado_academico(grado_id)
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE categoria (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE investigacion (
    investigacion_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(300) NOT NULL,
    fuente_financiamiento VARCHAR(200),
    ano_adjudicacion YEAR,
    periodo_ejecucion VARCHAR(100),
    link_verificacion TEXT,
    
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
        ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE patente (
    patente_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
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
