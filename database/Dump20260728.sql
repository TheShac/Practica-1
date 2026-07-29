-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: postgrado_historia
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cap_libro`
--

DROP TABLE IF EXISTS `cap_libro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cap_libro` (
  `cap_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nombre_capitulo` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_libro` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `editorial` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lugar` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano` year DEFAULT NULL,
  `autor_principal` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `autores` text COLLATE utf8mb4_unicode_ci,
  `link_verificacion` text COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cap_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `cap_libro_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `categoria_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`categoria_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `configuracion_sistema`
--

DROP TABLE IF EXISTS `configuracion_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracion_sistema` (
  `clave` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`clave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `consultorias`
--

DROP TABLE IF EXISTS `consultorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultorias` (
  `consultoria_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `titulo` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institucion_contratante` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano_adjudicacion` year DEFAULT NULL,
  `periodo_ejecucion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `objetivo` text COLLATE utf8mb4_unicode_ci,
  `link_verificacion` text COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`consultoria_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `consultorias_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `correo_organizacional`
--

DROP TABLE IF EXISTS `correo_organizacional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `correo_organizacional` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `correo` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `verificado` tinyint(1) NOT NULL DEFAULT '0',
  `verificado_en` timestamp NULL DEFAULT NULL,
  `actualizado_en` timestamp NULL DEFAULT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuario_correo_org` (`usuario_id`),
  UNIQUE KEY `uq_correo_org` (`correo`),
  CONSTRAINT `fk_co_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dominio_permitido`
--

DROP TABLE IF EXISTS `dominio_permitido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dominio_permitido` (
  `dominio_id` int NOT NULL AUTO_INCREMENT,
  `dominio` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`dominio_id`),
  UNIQUE KEY `uq_dominio` (`dominio`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `email_logs`
--

DROP TABLE IF EXISTS `email_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_logs` (
  `logs_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `correo` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('verificacion','recuperacion','notificacion','bienvenida','cambio_correo') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('pendiente','enviado','error') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `error` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `resend_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notificacion_id` int DEFAULT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`logs_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `notificacion_id` (`notificacion_id`),
  CONSTRAINT `fk_el_notif` FOREIGN KEY (`notificacion_id`) REFERENCES `notificacion` (`notificacion_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_el_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `grado_academico`
--

DROP TABLE IF EXISTS `grado_academico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grado_academico` (
  `grado_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nombre_grado` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institucion_grado` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pais_grado` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano_grado` year DEFAULT NULL,
  PRIMARY KEY (`grado_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `grado_academico_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `investigacion`
--

DROP TABLE IF EXISTS `investigacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `investigacion` (
  `investigacion_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `titulo` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fuente_financiamiento` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano_adjudicacion` year DEFAULT NULL,
  `periodo_ejecucion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rol_proyecto` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_verificacion` text COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`investigacion_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `investigacion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `libro`
--

DROP TABLE IF EXISTS `libro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `libro` (
  `libro_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nombre_libro` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `editorial` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lugar` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano` year DEFAULT NULL,
  `autor_principal` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `autores` text COLLATE utf8mb4_unicode_ci,
  `link_verificacion` text COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`libro_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `libro_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mail`
--

DROP TABLE IF EXISTS `mail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mail` (
  `mail_id` int NOT NULL AUTO_INCREMENT,
  `mail` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`mail_id`),
  UNIQUE KEY `mail` (`mail`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `mail_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `notificacion_id` int NOT NULL AUTO_INCREMENT,
  `remitente_id` int NOT NULL,
  `asunto` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mensaje` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `es_global` tinyint(1) NOT NULL DEFAULT '0',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `enviar_correo` tinyint(1) NOT NULL DEFAULT '0',
  `estado_envio` enum('pendiente','procesando','completado','con_errores') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pendiente',
  `cantidad_destinatarios` int NOT NULL DEFAULT '0',
  `cantidad_enviados` int NOT NULL DEFAULT '0',
  `cantidad_errores` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`notificacion_id`),
  KEY `fk_notif_remitente` (`remitente_id`),
  CONSTRAINT `fk_notif_remitente` FOREIGN KEY (`remitente_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notificacion_destinatario`
--

DROP TABLE IF EXISTS `notificacion_destinatario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notificacion_global_leido`
--

DROP TABLE IF EXISTS `notificacion_global_leido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `password_reset_token`
--

DROP TABLE IF EXISTS `password_reset_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_token` (
  `reset_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `token_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expira_en` timestamp NOT NULL,
  `usado` tinyint(1) NOT NULL DEFAULT '0',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reset_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `fk_prt_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `patente`
--

DROP TABLE IF EXISTS `patente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patente` (
  `patente_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `inventores` text COLLATE utf8mb4_unicode_ci,
  `nombre_patente` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `num_registro` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_solicitud` date DEFAULT NULL,
  `fecha_publicacion` date DEFAULT NULL,
  `estado` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_verificacion` text COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`patente_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `patente_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `programa`
--

DROP TABLE IF EXISTS `programa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programa` (
  `programa_id` int NOT NULL AUTO_INCREMENT,
  `nombre` enum('MAGISTER','DOCTORADO') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`programa_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `proyectos_intervencion`
--

DROP TABLE IF EXISTS `proyectos_intervencion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proyectos_intervencion` (
  `proyecto_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `titulo` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fuente_financiamiento` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano_adjudicacion` year DEFAULT NULL,
  `periodo_ejecucion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rol_proyecto` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_verificacion` text COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`proyecto_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `proyectos_intervencion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `publicaciones`
--

DROP TABLE IF EXISTS `publicaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publicaciones` (
  `publicacion_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  `titulo_articulo` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_revista` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ISSN` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano` year DEFAULT NULL,
  `autor_principal` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `autores` text COLLATE utf8mb4_unicode_ci,
  `link_verificacion` text COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`publicacion_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `publicaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE,
  CONSTRAINT `publicaciones_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`categoria_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reporte_academico`
--

DROP TABLE IF EXISTS `reporte_academico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporte_academico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `programa_id` int NOT NULL DEFAULT '1',
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
  UNIQUE KEY `uq_usuario_programa` (`usuario_id`,`programa_id`),
  KEY `fk_ra_programa` (`programa_id`),
  CONSTRAINT `fk_ra_programa` FOREIGN KEY (`programa_id`) REFERENCES `programa` (`programa_id`),
  CONSTRAINT `reporte_academico_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reporte_promedios`
--

DROP TABLE IF EXISTS `reporte_promedios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporte_promedios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `programa_id` int NOT NULL DEFAULT '1',
  `prom_wos_claustro` decimal(5,1) DEFAULT '0.0',
  `prom_wos_cuerpo` decimal(5,1) DEFAULT '0.0',
  `prom_wos_acad_claustro` decimal(5,1) DEFAULT '0.0',
  `prom_wos_acad_cuerpo` decimal(5,1) DEFAULT '0.0',
  `prom_libros_claustro` decimal(5,1) DEFAULT '0.0',
  `prom_libros_cuerpo` decimal(5,1) DEFAULT '0.0',
  `prom_fondecyt_claustro` decimal(5,1) DEFAULT '0.0',
  `prom_fondecyt_cuerpo` decimal(5,1) DEFAULT '0.0',
  `actualizado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_prom_programa` (`programa_id`),
  CONSTRAINT `fk_prom_programa` FOREIGN KEY (`programa_id`) REFERENCES `programa` (`programa_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reporte_wos_global`
--

DROP TABLE IF EXISTS `reporte_wos_global`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reporte_wos_global` (
  `id` int NOT NULL AUTO_INCREMENT,
  `programa_id` int NOT NULL DEFAULT '1',
  `tipo_academico` enum('Claustro','Colaborador') COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_wos` int DEFAULT '0',
  `actualizado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wos_programa_tipo` (`programa_id`,`tipo_academico`),
  CONSTRAINT `fk_wos_programa` FOREIGN KEY (`programa_id`) REFERENCES `programa` (`programa_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`rol_id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rol_academico`
--

DROP TABLE IF EXISTS `rol_academico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol_academico` (
  `rolaca_id` int NOT NULL AUTO_INCREMENT,
  `tipo_academico` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`rolaca_id`),
  UNIQUE KEY `tipo_academico` (`tipo_academico`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tesis`
--

DROP TABLE IF EXISTS `tesis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tesis` (
  `tesis_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `titulo_tesis` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_programa` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `institucion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tesis_dirigida` enum('Si','No') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano` year DEFAULT NULL,
  `autor` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rol_guia` enum('GUIA','CO_GUIA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `nivel_programa` enum('MAGISTER','DOCTORADO') COLLATE utf8mb4_unicode_ci NOT NULL,
  `link_verificacion` text COLLATE utf8mb4_unicode_ci,
  `google_drive_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tesis_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `tesis_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `titulacion`
--

DROP TABLE IF EXISTS `titulacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `titulacion` (
  `titulo_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `titulo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `institucion_titulacion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pais_titulacion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano_titulacion` year DEFAULT NULL,
  PRIMARY KEY (`titulo_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `titulacion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `rut` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `primer_nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `segundo_nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primer_apellido` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `segundo_apellido` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ano_ingreso` year DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contrasena` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lineas_investigacion` text COLLATE utf8mb4_unicode_ci,
  `rol_id` int NOT NULL,
  `google_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`usuario_id`),
  UNIQUE KEY `rut` (`rut`),
  UNIQUE KEY `uq_google_id` (`google_id`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuario_programa`
--

DROP TABLE IF EXISTS `usuario_programa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_programa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `programa_id` int NOT NULL,
  `rolaca_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuario_programa` (`usuario_id`,`programa_id`),
  KEY `fk_up_programa` (`programa_id`),
  KEY `fk_up_rolaca` (`rolaca_id`),
  CONSTRAINT `fk_up_programa` FOREIGN KEY (`programa_id`) REFERENCES `programa` (`programa_id`),
  CONSTRAINT `fk_up_rolaca` FOREIGN KEY (`rolaca_id`) REFERENCES `rol_academico` (`rolaca_id`),
  CONSTRAINT `fk_up_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verificacion_correo`
--

DROP TABLE IF EXISTS `verificacion_correo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verificacion_correo` (
  `verificar_id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `codigo_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expira_en` timestamp NOT NULL,
  `intentos_reenvio` int NOT NULL DEFAULT '0',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`verificar_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `fk_vc_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`usuario_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-28  1:33:26
