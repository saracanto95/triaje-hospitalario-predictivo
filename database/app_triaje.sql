-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Temps de generació: 10-10-2026 a les 18:44:53
-- Versió del servidor: 10.4.32-MariaDB
-- Versió de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de dades: `app_triaje`
--

-- --------------------------------------------------------

--
-- Estructura de la taula `estado_hospital`
--

CREATE TABLE `estado_hospital` (
  `idEstado` int(11) NOT NULL,
  `idHospital` int(11) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `tipo_dia` varchar(30) NOT NULL,
  `medicos_disp` int(11) NOT NULL,
  `enfermeros_disp` int(11) NOT NULL,
  `pacientes_espera` int(11) NOT NULL,
  `pacientes_consulta` int(11) NOT NULL,
  `pacientes_observacion` int(11) NOT NULL,
  `pacientes_criticos` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bolcament de dades per a la taula `estado_hospital`
--

INSERT INTO `estado_hospital` (`idEstado`, `idHospital`, `hora_inicio`, `hora_fin`, `tipo_dia`, `medicos_disp`, `enfermeros_disp`, `pacientes_espera`, `pacientes_consulta`, `pacientes_observacion`, `pacientes_criticos`) VALUES
(1, 1, '00:00:00', '07:59:59', 'laborable', 4, 8, 3, 3, 2, 1),
(2, 1, '08:00:00', '10:59:59', 'laborable', 4, 8, 4, 4, 3, 1),
(3, 1, '11:00:00', '15:59:59', 'laborable', 5, 9, 7, 5, 5, 1),
(4, 1, '16:00:00', '20:59:59', 'laborable', 5, 9, 8, 6, 6, 2),
(5, 1, '21:00:00', '23:59:59', 'laborable', 4, 8, 3, 4, 3, 1),
(6, 1, '00:00:00', '07:59:59', 'fin_de_semana_festivo', 4, 8, 2, 3, 2, 1),
(7, 1, '08:00:00', '10:59:59', 'fin_de_semana_festivo', 4, 8, 3, 4, 3, 1),
(8, 1, '11:00:00', '15:59:59', 'fin_de_semana_festivo', 5, 9, 7, 5, 5, 1),
(9, 1, '16:00:00', '20:59:59', 'fin_de_semana_festivo', 5, 9, 9, 6, 7, 2),
(10, 1, '21:00:00', '23:59:59', 'fin_de_semana_festivo', 4, 8, 3, 4, 3, 1),
(11, 2, '00:00:00', '07:59:59', 'laborable', 4, 8, 3, 3, 2, 1),
(12, 2, '08:00:00', '10:59:59', 'laborable', 4, 8, 4, 4, 3, 1),
(13, 2, '11:00:00', '15:59:59', 'laborable', 5, 9, 7, 5, 5, 1),
(14, 2, '16:00:00', '20:59:59', 'laborable', 5, 9, 8, 6, 6, 2),
(15, 2, '21:00:00', '23:59:59', 'laborable', 4, 8, 3, 4, 3, 1),
(16, 2, '00:00:00', '07:59:59', 'fin_de_semana_festivo', 4, 8, 2, 3, 2, 1),
(17, 2, '08:00:00', '10:59:59', 'fin_de_semana_festivo', 4, 8, 3, 4, 3, 1),
(18, 2, '11:00:00', '15:59:59', 'fin_de_semana_festivo', 5, 9, 7, 5, 5, 1),
(19, 2, '16:00:00', '20:59:59', 'fin_de_semana_festivo', 5, 9, 9, 6, 7, 2),
(20, 2, '21:00:00', '23:59:59', 'fin_de_semana_festivo', 4, 8, 3, 4, 3, 1),
(21, 3, '00:00:00', '07:59:59', 'laborable', 5, 10, 4, 6, 3, 1),
(22, 3, '08:00:00', '10:59:59', 'laborable', 6, 12, 6, 8, 6, 2),
(23, 3, '11:00:00', '15:59:59', 'laborable', 7, 14, 13, 12, 11, 4),
(24, 3, '16:00:00', '20:59:59', 'laborable', 7, 14, 15, 13, 13, 5),
(25, 3, '21:00:00', '23:59:59', 'laborable', 6, 12, 6, 8, 6, 2),
(26, 3, '00:00:00', '07:59:59', 'fin_de_semana_festivo', 5, 10, 4, 6, 3, 1),
(27, 3, '08:00:00', '10:59:59', 'fin_de_semana_festivo', 6, 11, 6, 7, 5, 1),
(28, 3, '11:00:00', '15:59:59', 'fin_de_semana_festivo', 6, 12, 10, 9, 8, 3),
(29, 3, '16:00:00', '20:59:59', 'fin_de_semana_festivo', 7, 13, 13, 11, 12, 4),
(30, 3, '21:00:00', '23:59:59', 'fin_de_semana_festivo', 6, 11, 6, 7, 5, 2),
(31, 4, '00:00:00', '07:59:59', 'laborable', 4, 9, 3, 5, 2, 1),
(32, 4, '08:00:00', '10:59:59', 'laborable', 5, 10, 5, 6, 4, 1),
(33, 4, '11:00:00', '15:59:59', 'laborable', 6, 11, 9, 8, 7, 2),
(34, 4, '16:00:00', '20:59:59', 'laborable', 6, 11, 11, 9, 8, 3),
(35, 4, '21:00:00', '23:59:59', 'laborable', 5, 10, 5, 6, 4, 1),
(36, 4, '00:00:00', '07:59:59', 'fin_de_semana_festivo', 4, 8, 3, 4, 2, 1),
(37, 4, '08:00:00', '10:59:59', 'fin_de_semana_festivo', 4, 9, 4, 5, 3, 1),
(38, 4, '11:00:00', '15:59:59', 'fin_de_semana_festivo', 5, 10, 7, 7, 5, 2),
(39, 4, '16:00:00', '20:59:59', 'fin_de_semana_festivo', 5, 10, 9, 8, 7, 2),
(40, 4, '21:00:00', '23:59:59', 'fin_de_semana_festivo', 4, 9, 4, 5, 3, 1),
(41, 5, '00:00:00', '07:59:59', 'laborable', 6, 12, 5, 8, 4, 1),
(42, 5, '08:00:00', '10:59:59', 'laborable', 7, 14, 8, 9, 7, 2),
(43, 5, '11:00:00', '15:59:59', 'laborable', 8, 16, 17, 15, 14, 4),
(44, 5, '16:00:00', '20:59:59', 'laborable', 8, 16, 19, 15, 16, 6),
(45, 5, '21:00:00', '23:59:59', 'laborable', 7, 14, 9, 10, 7, 2),
(46, 5, '00:00:00', '07:59:59', 'fin_de_semana_festivo', 6, 12, 5, 7, 4, 1),
(47, 5, '08:00:00', '10:59:59', 'fin_de_semana_festivo', 7, 13, 7, 8, 6, 2),
(48, 5, '11:00:00', '15:59:59', 'fin_de_semana_festivo', 7, 14, 12, 12, 11, 4),
(49, 5, '16:00:00', '20:59:59', 'fin_de_semana_festivo', 8, 15, 16, 14, 14, 5),
(50, 5, '21:00:00', '23:59:59', 'fin_de_semana_festivo', 7, 13, 8, 9, 6, 2),
(51, 6, '00:00:00', '07:59:59', 'laborable', 5, 10, 4, 6, 3, 1),
(52, 6, '08:00:00', '10:59:59', 'laborable', 6, 12, 6, 8, 6, 2),
(53, 6, '11:00:00', '15:59:59', 'laborable', 7, 14, 13, 12, 11, 4),
(54, 6, '16:00:00', '20:59:59', 'laborable', 7, 14, 15, 13, 13, 5),
(55, 6, '21:00:00', '23:59:59', 'laborable', 6, 12, 6, 8, 6, 2),
(56, 6, '00:00:00', '07:59:59', 'fin_de_semana_festivo', 5, 10, 4, 6, 3, 1),
(57, 6, '08:00:00', '10:59:59', 'fin_de_semana_festivo', 6, 11, 6, 7, 5, 1),
(58, 6, '11:00:00', '15:59:59', 'fin_de_semana_festivo', 6, 12, 10, 9, 8, 3),
(59, 6, '16:00:00', '20:59:59', 'fin_de_semana_festivo', 7, 13, 13, 11, 12, 4),
(60, 6, '21:00:00', '23:59:59', 'fin_de_semana_festivo', 6, 11, 6, 7, 5, 2),
(61, 7, '00:00:00', '07:59:59', 'laborable', 4, 8, 3, 3, 2, 1),
(62, 7, '08:00:00', '10:59:59', 'laborable', 5, 9, 5, 5, 3, 1),
(63, 7, '11:00:00', '15:59:59', 'laborable', 5, 10, 7, 6, 5, 2),
(64, 7, '16:00:00', '20:59:59', 'laborable', 6, 10, 10, 7, 7, 2),
(65, 7, '21:00:00', '23:59:59', 'laborable', 4, 9, 4, 4, 3, 1),
(66, 7, '00:00:00', '07:59:59', 'fin_de_semana_festivo', 4, 8, 2, 3, 2, 1),
(67, 7, '08:00:00', '10:59:59', 'fin_de_semana_festivo', 4, 8, 3, 4, 3, 1),
(68, 7, '11:00:00', '15:59:59', 'fin_de_semana_festivo', 5, 9, 7, 5, 4, 1),
(69, 7, '16:00:00', '20:59:59', 'fin_de_semana_festivo', 5, 9, 8, 5, 6, 2),
(70, 7, '21:00:00', '23:59:59', 'fin_de_semana_festivo', 4, 8, 3, 4, 3, 1),
(71, 8, '00:00:00', '07:59:59', 'laborable', 5, 9, 3, 5, 3, 1),
(72, 8, '08:00:00', '10:59:59', 'laborable', 6, 10, 6, 7, 4, 1),
(73, 8, '11:00:00', '15:59:59', 'laborable', 6, 11, 9, 8, 7, 2),
(74, 8, '16:00:00', '20:59:59', 'laborable', 7, 12, 12, 10, 10, 3),
(75, 8, '21:00:00', '23:59:59', 'laborable', 5, 10, 5, 6, 4, 1),
(76, 8, '00:00:00', '07:59:59', 'fin_de_semana_festivo', 5, 9, 3, 5, 2, 1),
(77, 8, '08:00:00', '10:59:59', 'fin_de_semana_festivo', 6, 10, 5, 6, 4, 1),
(78, 8, '11:00:00', '15:59:59', 'fin_de_semana_festivo', 6, 11, 9, 8, 7, 2),
(79, 8, '16:00:00', '20:59:59', 'fin_de_semana_festivo', 7, 12, 13, 10, 10, 3),
(80, 8, '21:00:00', '23:59:59', 'fin_de_semana_festivo', 5, 10, 4, 6, 4, 1),
(81, 9, '00:00:00', '07:59:59', 'laborable', 4, 8, 3, 3, 2, 1),
(82, 9, '08:00:00', '10:59:59', 'laborable', 4, 8, 4, 4, 3, 1),
(83, 9, '11:00:00', '15:59:59', 'laborable', 5, 9, 7, 5, 5, 1),
(84, 9, '16:00:00', '20:59:59', 'laborable', 5, 9, 8, 6, 6, 2),
(85, 9, '21:00:00', '23:59:59', 'laborable', 4, 8, 3, 4, 3, 1),
(86, 9, '00:00:00', '07:59:59', 'fin_de_semana_festivo', 4, 7, 2, 2, 2, 1),
(87, 9, '08:00:00', '10:59:59', 'fin_de_semana_festivo', 4, 8, 3, 4, 2, 1),
(88, 9, '11:00:00', '15:59:59', 'fin_de_semana_festivo', 5, 8, 6, 5, 4, 1),
(89, 9, '16:00:00', '20:59:59', 'fin_de_semana_festivo', 5, 9, 8, 5, 6, 2),
(90, 9, '21:00:00', '23:59:59', 'fin_de_semana_festivo', 4, 8, 3, 4, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de la taula `hospitales`
--

CREATE TABLE `hospitales` (
  `idHospital` int(11) NOT NULL,
  `nombre` varchar(120) NOT NULL,
  `tipo_centro` varchar(50) NOT NULL,
  `direccion` varchar(150) NOT NULL,
  `municipio` varchar(80) NOT NULL,
  `latitud` decimal(10,6) NOT NULL,
  `longitud` decimal(10,6) NOT NULL,
  `camas_totales` int(11) NOT NULL,
  `camas_urg_estimadas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Bolcament de dades per a la taula `hospitales`
--

INSERT INTO `hospitales` (`idHospital`, `nombre`, `tipo_centro`, `direccion`, `municipio`, `latitud`, `longitud`, `camas_totales`, `camas_urg_estimadas`) VALUES
(1, 'Hospital Universitario de Dénia', 'hospital universitario', 'Partida Beniadlà, s/n', 'Dénia', 38.834610, 0.060280, 266, 26),
(2, 'Hospital Universitario Marina Baixa de La Vila Joiosa', 'hospital universitario', 'Avenida Alcalde En Jaume Botella Mayor, 7', 'La Vila Joiosa', 38.529840, -0.198330, 270, 27),
(3, 'Hospital Universitario San Juan de Alicante', 'hospital universitario', 'Carretera C. NAL. 332 Alicante-Valencia, s/n', 'Sant Joan d\'Alacant', 38.388730, -0.433990, 396, 40),
(4, 'Hospital General Universitario de Elda - Virgen de la Salud', 'hospital general universitario', 'Carretera Sax, s/n', 'Elda', 38.494180, -0.806080, 513, 39),
(5, 'Hospital General Universitario Dr. Balmis', 'hospital general universitario', 'Avenida Pintor Baeza, 12', 'Alicante', 38.363190, -0.484900, 807, 80),
(6, 'Hospital General Universitario de Elche', 'hospital general universitario', 'Calle Camí Almazara, 11', 'Elche', 38.260330, -0.685060, 408, 40),
(7, 'Hospital Universitario Vega Baja de Orihuela', 'hospital universitario', 'Carretera Orihuela-Almoradí, s/n', 'Orihuela', 38.089010, -0.854400, 336, 34),
(8, 'Hospital Universitario de Torrevieja', 'hospital universitario', 'Carretera CV-95 S. Miguel Salinas-Torrevieja, pda. La Ceñuela, s/n', 'Torrevieja', 37.963630, -0.715780, 269, 27),
(9, 'Hospital Universitario Vinalopó', 'hospital universitario', 'Calle Tónico Sansano Mora, 14', 'Elche', 38.255210, -0.717120, 214, 21);

--
-- Índexs per a les taules bolcades
--

--
-- Índexs per a la taula `estado_hospital`
--
ALTER TABLE `estado_hospital`
  ADD PRIMARY KEY (`idEstado`);

--
-- Índexs per a la taula `hospitales`
--
ALTER TABLE `hospitales`
  ADD PRIMARY KEY (`idHospital`);

--
-- AUTO_INCREMENT per les taules bolcades
--

--
-- AUTO_INCREMENT per la taula `estado_hospital`
--
ALTER TABLE `estado_hospital`
  MODIFY `idEstado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT per la taula `hospitales`
--
ALTER TABLE `hospitales`
  MODIFY `idHospital` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
