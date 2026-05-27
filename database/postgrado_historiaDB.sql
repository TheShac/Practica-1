CREATE DATABASE IF NOT EXISTS `postgrado_historia` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_0900_ai_ci;

USE `postgrado_historia`;

-- ------------------------------------------------------
-- 1. TABLA: rol
-- ------------------------------------------------------
CREATE TABLE `rol` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`rol_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 2. TABLA: rol_academico
-- ------------------------------------------------------
CREATE TABLE `rol_academico` (
  `rolaca_id` int NOT NULL AUTO_INCREMENT,
  `tipo_academico` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`rolaca_id`),
  UNIQUE KEY `tipo_academico` (`tipo_academico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 3. TABLA: categoria
-- ------------------------------------------------------
CREATE TABLE `categoria` (
  `categoria_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`categoria_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 4. TABLA: usuario
-- ------------------------------------------------------
CREATE TABLE `usuario` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `rut` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `primer_nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `segundo_nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primer_apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `segundo_apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano_ingreso` year DEFAULT NULL,
  `telefono` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contrasena` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lineas_investigacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rol_id` int NOT NULL,
  `rolaca_id` int DEFAULT NULL,
  PRIMARY KEY (`usuario_id`),
  UNIQUE KEY `rut` (`rut`),
  KEY `rol_id` (`rol_id`),
  KEY `rolaca_id` (`rolaca_id`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`rol_id`),
  CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`rolaca_id`) REFERENCES `rol_academico` (`rolaca_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 5. TABLA: cap_libro
-- ------------------------------------------------------
CREATE TABLE `cap_libro` (
  `cap_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nombre_capitulo` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_libro` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `editorial` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lugar` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano` year DEFAULT NULL,
  `autor_principal` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `autores` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `link_verificacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cap_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `cap_libro_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 6. TABLA: consultorias
-- ------------------------------------------------------
CREATE TABLE `consultorias` (
  `consultoria_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `titulo` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institucion_contratante` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano_adjudicacion` year DEFAULT NULL,
  `periodo_ejecucion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objetivo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `link_verificacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`consultoria_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `consultorias_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 7. TABLA: grado_academico
-- ------------------------------------------------------
CREATE TABLE `grado_academico` (
  `grado_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nombre_grado` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institucion_grado` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pais_grado` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano_grado` year DEFAULT NULL,
  PRIMARY KEY (`grado_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `grado_academico_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 8. TABLA: investigacion
-- ------------------------------------------------------
CREATE TABLE `investigacion` (
  `investigacion_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `titulo` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fuente_financiamiento` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano_adjudicacion` year DEFAULT NULL,
  `periodo_ejecucion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rol_proyecto` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_verificacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`investigacion_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `investigacion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 9. TABLA: libro
-- ------------------------------------------------------
CREATE TABLE `libro` (
  `libro_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nombre_libro` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `editorial` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lugar` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano` year DEFAULT NULL,
  `autor_principal` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `autores` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `link_verificacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`libro_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `libro_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 10. TABLA: mail
-- ------------------------------------------------------
CREATE TABLE `mail` (
  `mail_id` int NOT NULL AUTO_INCREMENT,
  `mail` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`mail_id`),
  UNIQUE KEY `mail` (`mail`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `mail_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 11. TABLA: notificacion
-- ------------------------------------------------------
CREATE TABLE `notificacion` (
  `notificacion_id` int NOT NULL AUTO_INCREMENT,
  `remitente_id` int NOT NULL,
  `asunto` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensaje` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `es_global` tinyint(1) NOT NULL DEFAULT '0',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notificacion_id`),
  KEY `fk_notif_remitente` (`remitente_id`),
  CONSTRAINT `fk_notif_remitente` FOREIGN KEY (`remitente_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 12. TABLA: notificacion_destinatario
-- ------------------------------------------------------
CREATE TABLE `notificacion_destinatario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `notificacion_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `leido` tinyint(1) NOT NULL DEFAULT '0',
  `leido_en` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_nd` (`notificacion_id`,`usuario_id`),
  KEY `fk_nd_usuario` (`usuario_id`),
  CONSTRAINT `fk_nd_notif` FOREIGN KEY (`notificacion_id`) REFERENCES `notificacion` (`notificacion_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_nd_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 13. TABLA: notificacion_global_leido
-- ------------------------------------------------------
CREATE TABLE `notificacion_global_leido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `notificacion_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `leido_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ngl` (`notificacion_id`,`usuario_id`),
  KEY `fk_ngl_usuario` (`usuario_id`),
  CONSTRAINT `fk_ngl_notif` FOREIGN KEY (`notificacion_id`) REFERENCES `notificacion` (`notificacion_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ngl_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 14. TABLA: patente
-- ------------------------------------------------------
CREATE TABLE `patente` (
  `patente_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `inventores` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `nombre_patente` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_registro` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_solicitud` date DEFAULT NULL,
  `fecha_publicacion` date DEFAULT NULL,
  `estado` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_verificacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`patente_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `patente_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 15. TABLA: proyectos_intervencion
-- ------------------------------------------------------
CREATE TABLE `proyectos_intervencion` (
  `proyecto_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `titulo` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fuente_financiamiento` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano_adjudicacion` year DEFAULT NULL,
  `periodo_ejecucion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rol_proyecto` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_verificacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`proyecto_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `proyectos_intervencion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 16. TABLA: publicaciones
-- ------------------------------------------------------
CREATE TABLE `publicaciones` (
  `publicacion_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  `titulo_articulo` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_revista` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ISSN` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano` year DEFAULT NULL,
  `autor_principal` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `autores` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `link_verificacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`publicacion_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `publicaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE,
  CONSTRAINT `publicaciones_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`categoria_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 17. TABLA: reporte_academico
-- ------------------------------------------------------
CREATE TABLE `reporte_academico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `total_wos_scopus_5_anios` int DEFAULT '0',
  `total_scielo_5_anios` int DEFAULT '0',
  `otros_articulos` int DEFAULT '0',
  `libros_area` int DEFAULT '0',
  `libros_otro` int DEFAULT '0',
  `cap_area` int DEFAULT '0',
  `cap_otro` int DEFAULT '0',
  `edicion_area` int DEFAULT '0',
  `edicion_otro` int DEFAULT '0',
  `proyectos_fondecyt` int DEFAULT '0',
  `otros_proyectos` int DEFAULT '0',
  `actualizado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `reporte_academico_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 18. TABLA: reporte_promedios
-- ------------------------------------------------------
CREATE TABLE `reporte_promedios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prom_wos_claustro` decimal(5,1) DEFAULT '0.0',
  `prom_wos_cuerpo` decimal(5,1) DEFAULT '0.0',
  `prom_wos_acad_claustro` decimal(5,1) DEFAULT '0.0',
  `prom_wos_acad_cuerpo` decimal(5,1) DEFAULT '0.0',
  `prom_libros_claustro` decimal(5,1) DEFAULT '0.0',
  `prom_libros_cuerpo` decimal(5,1) DEFAULT '0.0',
  `prom_fondecyt_claustro` decimal(5,1) DEFAULT '0.0',
  `prom_fondecyt_cuerpo` decimal(5,1) DEFAULT '0.0',
  `actualizado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 19. TABLA: reporte_wos_global
-- ------------------------------------------------------
CREATE TABLE `reporte_wos_global` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_academico` enum('Claustro','Colaborador') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_wos` int DEFAULT '0',
  `actualizado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tipo_academico` (`tipo_academico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 20. TABLA: tesis
-- ------------------------------------------------------
CREATE TABLE `tesis` (
  `tesis_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `titulo_tesis` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_programa` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `institucion` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tesis_dirigida` enum('Si','No') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano` year DEFAULT NULL,
  `autor` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rol_guia` enum('GUIA','CO_GUIA') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nivel_programa` enum('MAGISTER','DOCTORADO') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `link_verificacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tesis_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `tesis_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------
-- 21. TABLA: titulacion
-- ------------------------------------------------------
CREATE TABLE `titulacion` (
  `titulo_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `titulo` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `institucion_titulacion` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pais_titulacion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano_titulacion` year DEFAULT NULL,
  PRIMARY KEY (`titulo_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `titulacion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;