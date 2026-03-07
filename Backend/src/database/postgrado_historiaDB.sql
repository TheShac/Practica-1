CREATE DATABASE IF NOT EXISTS postgrado_historia;
USE postgrado_historia;

-- 1. Tablas Maestras (Independientes)
CREATE TABLE rol (
    rol_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rol_academico (
    rolaca_id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_academico VARCHAR(100) NOT NULL
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categoria (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- 2. Tabla Principal: Usuario
CREATE TABLE usuario (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    rut VARCHAR(15) NOT NULL UNIQUE,
    primer_nombre VARCHAR(100) NOT NULL,
    segundo_nombre VARCHAR(100),
    primer_apellido VARCHAR(100) NOT NULL,
    segundo_apellido VARCHAR(100),
    ano_ingreso YEAR,
    telefono VARCHAR(20),
    contrasena VARCHAR(255) NOT NULL,
    lineas_investigacion TEXT,
    rol_id INT,
    rolaca_id INT,
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES rol(rol_id),
    CONSTRAINT fk_usuario_rolaca FOREIGN KEY (rolaca_id) REFERENCES rol_academico(rolaca_id)
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- 3. Tablas Dependientes de Usuario
CREATE TABLE mail (
    mail_id INT AUTO_INCREMENT PRIMARY KEY,
    mail VARCHAR(150) NOT NULL,
    usuario_id INT,
    CONSTRAINT fk_mail_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE grado_academico (
    grado_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    nombre_grado VARCHAR(100),
    institucion_grado VARCHAR(200),
    pais_grado VARCHAR(100),
    ano_grado YEAR,
    CONSTRAINT fk_grado_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE titulacion (
    titulo_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    titulo VARCHAR(200),
    institucion_titulacion VARCHAR(200),
    pais_titulacion VARCHAR(100),
    ano_titulacion YEAR,
    CONSTRAINT fk_titulacion_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- 4. Producción Académica e Investigación
CREATE TABLE publicaciones (
    publicacion_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    categoria_id INT,
    titulo_articulo VARCHAR(300),
    nombre_revista VARCHAR(200),
    ISSN VARCHAR(50),
    ano YEAR,
    autor_principal VARCHAR(200),
    autores TEXT,
    link_verificacion TEXT,
    estado VARCHAR(100),
    CONSTRAINT fk_pub_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_pub_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(categoria_id)
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE libro (
    libro_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    nombre_libro VARCHAR(300),
    editorial VARCHAR(200),
    lugar VARCHAR(200),
    ano YEAR,
    autor_principal VARCHAR(200),
    autores TEXT,
    link_verificacion TEXT,
    estado VARCHAR(100),
    CONSTRAINT fk_libro_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cap_libro (
    cap_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    nombre_capitulo VARCHAR(300),
    nombre_libro VARCHAR(300),
    editorial VARCHAR(200),
    lugar VARCHAR(200),
    ano YEAR,
    autor_principal VARCHAR(200),
    autores TEXT,
    link_verificacion TEXT,
    estado VARCHAR(100),
    CONSTRAINT fk_cap_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE investigacion (
    investigacion_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    titulo VARCHAR(300),
    fuente_financiamiento VARCHAR(200),
    ano_adjudicacion YEAR,
    periodo_ejecucion VARCHAR(100),
    rol_proyecton VARCHAR(100),
    link_verificacion TEXT,
    CONSTRAINT fk_inv_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tesis (
    tesis_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    titulo_tesis VARCHAR(300),
    nombre_programa VARCHAR(200),
    institucion VARCHAR(200),
    tesis_dirigida ENUM('Si', 'No'),
    ano YEAR,
    autor VARCHAR(200),
    rol_guia ENUM('GUIA', 'CO_GUIA'),
    nivel_programa ENUM('MAGISTER', 'DOCTORADO'),
    link_verificacion TEXT,
    CONSTRAINT fk_tesis_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE patente (
    patente_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    inventores TEXT,
    nombre_patente VARCHAR(300),
    num_registro VARCHAR(100),
    fecha_solicitud DATE,
    fecha_publicacion DATE,
    estado VARCHAR(100),
    link_verificacion TEXT,
    CONSTRAINT fk_patente_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE proyectos_intervencion (
    proyecto_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(300) NOT NULL,
    fuente_financiamiento VARCHAR(200),
    ano_adjudicacion YEAR,
    periodo_ejecucion VARCHAR(100),
    rol_proyecto VARCHAR(150),
    link_verificacion TEXT,

    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
        ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE consultorias (
    consultoria_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(300) NOT NULL,
    institucion_contratante VARCHAR(200),
    ano_adjudicacion YEAR,
    periodo_ejecucion VARCHAR(100),
    objetivo TEXT,
    link_verificacion TEXT,

    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
        ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reporte_academico (
  id INT AUTO_INCREMENT PRIMARY KEY,

  usuario_id INT NOT NULL UNIQUE,

  total_wos_scopus_5_anios INT DEFAULT 0,
  total_scielo_5_anios INT DEFAULT 0,
  otros_articulos INT DEFAULT 0,

  libros_area INT DEFAULT 0,
  libros_otro INT DEFAULT 0,

  cap_area INT DEFAULT 0,
  cap_otro INT DEFAULT 0,

  edicion_area INT DEFAULT 0,
  edicion_otro INT DEFAULT 0,

  proyectos_fondecyt INT DEFAULT 0,
  otros_proyectos INT DEFAULT 0,

  actualizado_en TIMESTAMP 
    DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (usuario_id) 
    REFERENCES usuario(usuario_id)
    ON DELETE CASCADE
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reporte_wos_global (
  id INT AUTO_INCREMENT PRIMARY KEY,

  tipo_academico ENUM('Claustro','Colaborador') NOT NULL UNIQUE,

  total_wos INT DEFAULT 0,

  actualizado_en TIMESTAMP 
    DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP
)ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notificacion (
    notificacion_id INT AUTO_INCREMENT PRIMARY KEY,
    remitente_id    INT NOT NULL,
    asunto          VARCHAR(200) NOT NULL,
    mensaje         TEXT NOT NULL,
    es_global       TINYINT(1) NOT NULL DEFAULT 0,   
    creado_en       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_remitente FOREIGN KEY (remitente_id)
        REFERENCES usuario(usuario_id) ON DELETE CASCADE
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notificacion_destinatario (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    notificacion_id INT NOT NULL,
    usuario_id      INT NOT NULL,
    leido           TINYINT(1) NOT NULL DEFAULT 0,
    leido_en        TIMESTAMP NULL,
    CONSTRAINT fk_nd_notif   FOREIGN KEY (notificacion_id) REFERENCES notificacion(notificacion_id) ON DELETE CASCADE,
    CONSTRAINT fk_nd_usuario FOREIGN KEY (usuario_id)      REFERENCES usuario(usuario_id)           ON DELETE CASCADE,
    UNIQUE KEY uq_nd (notificacion_id, usuario_id)
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notificacion_global_leido (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    notificacion_id INT NOT NULL,
    usuario_id      INT NOT NULL,
    leido_en        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ngl_notif   FOREIGN KEY (notificacion_id) REFERENCES notificacion(notificacion_id) ON DELETE CASCADE,
    CONSTRAINT fk_ngl_usuario FOREIGN KEY (usuario_id)      REFERENCES usuario(usuario_id)           ON DELETE CASCADE,
    UNIQUE KEY uq_ngl (notificacion_id, usuario_id)
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci;