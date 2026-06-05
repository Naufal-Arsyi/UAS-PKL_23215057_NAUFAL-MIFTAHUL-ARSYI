-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 04, 2026 at 06:31 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `netreport_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `gejala`
--

CREATE TABLE `gejala` (
  `id` varchar(10) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `deskripsi` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `gejala`
--

INSERT INTO `gejala` (`id`, `nama`, `deskripsi`, `created_at`, `updated_at`) VALUES
('G01', 'WiFi terasa lambat', 'Kecepatan unduh/unggah jauh di bawah normal, halaman web lama terbuka', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G02', 'Tidak bisa terhubung ke WiFi', 'Perangkat gagal join SSID, muncul pesan Authentication Failed atau timeout', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G03', 'WiFi sering putus-nyambung', 'Koneksi terputus dan tersambung kembali berulang kali dalam waktu singkat', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G04', 'Internet connected tapi tidak bisa browsing', 'Status terhubung ke WiFi tetapi tidak bisa membuka website apapun', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G05', 'Sinyal WiFi lemah / tidak stabil', 'Indikator sinyal rendah, koneksi tidak stabil meski dekat router', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G06', 'Semua perangkat tidak mendapat internet', 'Seluruh device di jaringan kehilangan akses internet secara bersamaan', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G07', 'Hanya satu perangkat yang bermasalah', 'Perangkat lain berjalan normal, hanya satu unit yang gagal terhubung', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G08', 'Ping tinggi / lag saat meeting atau gaming', 'Latency sangat tinggi lebih dari 100ms, video call patah-patah atau game lag berat', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G09', 'Router / AP sering restart sendiri', 'Perangkat jaringan mati dan nyala sendiri tanpa perintah', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G10', 'Tidak bisa membuka website tertentu', 'Website spesifik tidak dapat diakses meski situs lain berjalan normal', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G11', 'Indikator LOS Modem menyala', 'Lampu LOS pada modem menyala menandakan signal loss dari ISP', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G12', 'Indikator PON Modem menyala', 'Lampu PON pada modem bermasalah atau tidak normal', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G13', 'WiFi hanya bermasalah pada jam tertentu', 'Gangguan terjadi hanya pada waktu spesifik atau peak hours', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G14', 'Router terasa sangat panas', 'Router atau AP terasa panas saat disentuh', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G15', 'Modem tidak mendapatkan IP WAN', 'Status modem menunjukkan belum mendapat IP address dari ISP', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G16', 'Lampu internet modem berkedip terus', 'Indikator internet modem terus berkedip dan belum stabil', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G17', 'WiFi muncul tetapi tidak ada akses internet', 'Perangkat terhubung ke WiFi tapi tidak bisa akses internet', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G18', 'Muncul pesan IP conflict detected', 'Sistem mendeteksi ada perangkat lain menggunakan IP yang sama', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G19', 'Perangkat harus reconnect berkali-kali', 'Perangkat sering terputus dan perlu reconnect manual berulang kali', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G20', 'Kecepatan download sangat lambat tapi upload normal', 'Download jauh lebih lambat dari upload', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G21', 'Kecepatan upload sangat lambat tapi download normal', 'Upload jauh lebih lambat dari download', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G22', 'Website tertentu diblokir atau tidak dapat diakses', 'Website spesifik tidak bisa diakses namun situs lain normal', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G23', 'Semua perangkat mendapat IP yang sama', 'Multiple device memiliki IP address identik', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G24', 'Router sering freeze atau hang', 'Router tidak responsif dan perlu restart manual', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G25', 'Sinyal WiFi hilang saat jauh sedikit dari router', 'Coverage WiFi sangat terbatas', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G26', 'Ping normal tetapi browsing lambat', 'Latency rendah tetapi website sangat lambat dibuka', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G27', 'Game online disconnect terus', 'Koneksi game putus berkali-kali', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G28', 'YouTube buffering terus', 'Video streaming selalu buffering atau loading', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G29', 'WiFi connect tetapi No Internet Access', 'Terhubung ke WiFi tetapi status menunjukkan tidak ada internet', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G30', 'Router reboot saat banyak perangkat terhubung', 'Router restart sendiri ketika banyak device terkoneksi', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G31', 'Tidak bisa mendapatkan alamat IP otomatis', 'DHCP gagal memberikan IP ke perangkat', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G32', 'DNS resolving sangat lambat', 'Resolusi nama domain berjalan sangat lambat', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G33', 'Kabel LAN terasa longgar', 'Kabel jaringan longgar atau tidak tersambung dengan baik', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G34', 'Lampu LAN modem tidak menyala', 'Indikator LAN pada modem tidak aktif', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G35', 'Modem sering restart setelah listrik turun', 'Modem restart berulang setelah pemadaman listrik', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G36', 'WiFi 2.4GHz normal tetapi 5GHz hilang', 'Band 5GHz tidak terdeteksi', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G37', 'WiFi 5GHz normal tetapi 2.4GHz bermasalah', 'Band 2.4GHz hilang atau tidak stabil', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G38', 'Internet putus saat hujan', 'Koneksi terganggu ketika terjadi hujan', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G39', 'LOS berkedip merah', 'Indikator LOS modem berkedip merah', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G40', 'PON berkedip tidak normal', 'Indikator PON berkedip tidak sesuai pola normal', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G41', 'Sinyal WiFi penuh tetapi internet lambat', 'Sinyal penuh namun kecepatan internet sangat lambat', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G42', 'DHCP failed pada perangkat', 'Perangkat gagal mendapat DHCP lease', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G43', 'Router tidak bisa menyimpan konfigurasi', 'Konfigurasi berubah sendiri atau tidak tersimpan', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G44', 'Sering diminta login ulang hotspot', 'User sering diminta login kembali ke hotspot', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G45', 'Website HTTPS tertentu gagal dibuka', 'Website HTTPS tertentu tidak dapat diakses', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G46', 'Internet normal melalui kabel tetapi WiFi lambat', 'Ethernet normal tetapi WiFi sangat lambat', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G47', 'Ada perangkat asing terhubung ke jaringan', 'Perangkat tidak dikenal terhubung ke WiFi', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G48', 'Router tidak dapat diakses melalui 192.168.x.x', 'Halaman admin router tidak bisa dibuka', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G49', 'Koneksi putus saat microwave atau perangkat elektronik aktif', 'WiFi terganggu oleh interferensi perangkat elektronik', '2026-06-04 06:00:11', '2026-06-04 06:00:11'),
('G50', 'Ping ke gateway timeout', 'Tidak dapat melakukan ping ke gateway atau router', '2026-06-04 06:00:11', '2026-06-04 06:00:11');

-- --------------------------------------------------------

--
-- Table structure for table `penyebab`
--

CREATE TABLE `penyebab` (
  `id` varchar(10) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `dispatch` enum('self','remote','onsite') NOT NULL,
  `solusi` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `penyebab`
--

INSERT INTO `penyebab` (`id`, `nama`, `dispatch`, `solusi`, `created_at`, `updated_at`) VALUES
('P01', 'Bandwidth penuh / overload pengguna', 'self', 'Batasi jumlah perangkat aktif. Jadwalkan aktivitas berat di luar jam kerja. Pertimbangkan upgrade paket bandwidth.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P02', 'Gangguan dari ISP', 'remote', 'Teknisi akan mengecek status layanan ISP dan melakukan eskalasi tiket ke provider.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P03', 'Router overload', 'remote', 'Teknisi akan melakukan restart terjadwal, optimasi konfigurasi QoS, dan memantau beban router.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P04', 'Access Point rusak', 'onsite', 'Teknisi harus hadir untuk inspeksi fisik AP, penggantian unit, atau re-mounting.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P05', 'Kabel LAN putus / longgar', 'onsite', 'Teknisi harus hadir untuk pengecekan dan penggantian kabel, konektor RJ45, atau patch panel.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P06', 'DHCP bermasalah', 'remote', 'Teknisi akan merestart DHCP server, memperluas pool IP, atau memperbarui lease time.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P07', 'Konflik IP Address', 'remote', 'Teknisi akan mengidentifikasi IP yang konflik dan memperbaiki konfigurasi DHCP.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P08', 'Interferensi sinyal WiFi', 'self', 'Ubah channel WiFi ke channel yang tidak ramai dan aktifkan band 5GHz jika tersedia.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P09', 'DNS bermasalah', 'self', 'Ubah DNS ke 8.8.8.8 atau 1.1.1.1 dan lakukan flush DNS cache.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P10', 'Perangkat client bermasalah (Modem)', 'onsite', 'Teknisi akan memeriksa perangkat fisik dan melakukan replacement jika diperlukan.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P11', 'DNS bermasalah', 'remote', 'Teknisi akan mengubah DNS server ke public DNS atau restart DNS service.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P12', 'Firmware router bermasalah', 'remote', 'Teknisi akan melakukan update firmware router atau rollback ke versi stabil.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P13', 'Adaptor atau power router tidak stabil', 'onsite', 'Teknisi harus hadir untuk inspeksi fisik dan penggantian adaptor.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P14', 'Firewall atau blokir website', 'remote', 'Teknisi akan mengecek firewall rules dan policy blocking.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P15', 'Konfigurasi router salah', 'remote', 'Teknisi akan mereview dan memperbaiki konfigurasi router.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P16', 'TX RX power tidak cukup', 'remote', 'Teknisi akan mengoptimalkan TX/RX power levels.', '2026-06-04 06:01:13', '2026-06-04 06:01:13'),
('P17', 'Kabel tertekuk', 'onsite', 'Teknisi harus hadir untuk inspeksi dan penggantian kabel yang rusak.', '2026-06-04 06:01:13', '2026-06-04 06:01:13');

-- --------------------------------------------------------

--
-- Table structure for table `rules`
--

CREATE TABLE `rules` (
  `id` int NOT NULL,
  `penyebab_id` varchar(10) NOT NULL,
  `gejala_id` varchar(10) NOT NULL,
  `bobot` decimal(4,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rules`
--

INSERT INTO `rules` (`id`, `penyebab_id`, `gejala_id`, `bobot`, `created_at`) VALUES
(1, 'P01', 'G01', '0.80', '2026-06-04 06:03:45'),
(2, 'P01', 'G08', '0.80', '2026-06-04 06:03:45'),
(3, 'P01', 'G13', '0.80', '2026-06-04 06:03:45'),
(4, 'P01', 'G20', '0.80', '2026-06-04 06:03:45'),
(5, 'P01', 'G21', '0.80', '2026-06-04 06:03:45'),
(6, 'P01', 'G27', '0.80', '2026-06-04 06:03:45'),
(7, 'P01', 'G28', '0.80', '2026-06-04 06:03:45'),
(8, 'P01', 'G30', '0.80', '2026-06-04 06:03:45'),
(9, 'P01', 'G41', '0.80', '2026-06-04 06:03:45'),
(10, 'P02', 'G04', '0.70', '2026-06-04 06:18:53'),
(11, 'P02', 'G06', '0.70', '2026-06-04 06:18:53'),
(12, 'P02', 'G11', '0.70', '2026-06-04 06:18:53'),
(13, 'P02', 'G15', '0.70', '2026-06-04 06:18:53'),
(14, 'P02', 'G16', '0.70', '2026-06-04 06:18:53'),
(15, 'P02', 'G17', '0.70', '2026-06-04 06:18:53'),
(16, 'P02', 'G29', '0.70', '2026-06-04 06:18:53'),
(17, 'P02', 'G38', '0.70', '2026-06-04 06:18:53'),
(18, 'P02', 'G39', '0.70', '2026-06-04 06:18:53'),
(19, 'P02', 'G40', '0.70', '2026-06-04 06:18:53'),
(20, 'P03', 'G09', '0.60', '2026-06-04 06:19:04'),
(21, 'P03', 'G14', '0.60', '2026-06-04 06:19:04'),
(22, 'P03', 'G24', '0.60', '2026-06-04 06:19:04'),
(23, 'P03', 'G30', '0.60', '2026-06-04 06:19:04'),
(24, 'P03', 'G43', '0.60', '2026-06-04 06:19:04'),
(25, 'P03', 'G48', '0.60', '2026-06-04 06:19:04'),
(26, 'P04', 'G05', '0.90', '2026-06-04 06:19:16'),
(27, 'P04', 'G25', '0.90', '2026-06-04 06:19:16'),
(28, 'P04', 'G36', '0.90', '2026-06-04 06:19:16'),
(29, 'P04', 'G37', '0.90', '2026-06-04 06:19:16'),
(30, 'P04', 'G46', '0.90', '2026-06-04 06:19:16'),
(31, 'P04', 'G49', '0.90', '2026-06-04 06:19:16'),
(32, 'P05', 'G03', '0.90', '2026-06-04 06:19:27'),
(33, 'P05', 'G06', '0.90', '2026-06-04 06:19:27'),
(34, 'P05', 'G33', '0.90', '2026-06-04 06:19:27'),
(35, 'P05', 'G34', '0.90', '2026-06-04 06:19:27'),
(36, 'P05', 'G38', '0.90', '2026-06-04 06:19:27'),
(37, 'P05', 'G50', '0.90', '2026-06-04 06:19:27'),
(38, 'P06', 'G06', '0.70', '2026-06-04 06:19:41'),
(39, 'P06', 'G23', '0.70', '2026-06-04 06:19:41'),
(40, 'P06', 'G31', '0.70', '2026-06-04 06:19:41'),
(41, 'P06', 'G42', '0.70', '2026-06-04 06:19:41'),
(42, 'P07', 'G02', '0.80', '2026-06-04 06:19:52'),
(43, 'P07', 'G18', '0.80', '2026-06-04 06:19:52'),
(44, 'P07', 'G23', '0.80', '2026-06-04 06:19:52'),
(45, 'P07', 'G31', '0.80', '2026-06-04 06:19:52'),
(46, 'P08', 'G05', '0.80', '2026-06-04 06:20:01'),
(47, 'P08', 'G08', '0.80', '2026-06-04 06:20:01'),
(48, 'P08', 'G25', '0.80', '2026-06-04 06:20:01'),
(49, 'P08', 'G49', '0.80', '2026-06-04 06:20:01'),
(50, 'P09', 'G05', '0.70', '2026-06-04 06:20:10'),
(51, 'P09', 'G25', '0.70', '2026-06-04 06:20:10'),
(52, 'P09', 'G41', '0.70', '2026-06-04 06:20:10'),
(53, 'P09', 'G46', '0.70', '2026-06-04 06:20:10'),
(54, 'P10', 'G07', '0.90', '2026-06-04 06:20:18'),
(55, 'P10', 'G19', '0.90', '2026-06-04 06:20:18'),
(56, 'P10', 'G42', '0.90', '2026-06-04 06:20:18'),
(57, 'P11', 'G10', '0.60', '2026-06-04 06:20:26'),
(58, 'P11', 'G26', '0.60', '2026-06-04 06:20:26'),
(59, 'P11', 'G32', '0.60', '2026-06-04 06:20:26'),
(60, 'P11', 'G45', '0.60', '2026-06-04 06:20:26'),
(61, 'P11', 'G10', '0.60', '2026-06-04 06:20:35'),
(62, 'P11', 'G26', '0.60', '2026-06-04 06:20:35'),
(63, 'P11', 'G32', '0.60', '2026-06-04 06:20:35'),
(64, 'P11', 'G45', '0.60', '2026-06-04 06:20:35'),
(65, 'P12', 'G09', '0.70', '2026-06-04 06:20:53'),
(66, 'P12', 'G24', '0.70', '2026-06-04 06:20:53'),
(67, 'P12', 'G43', '0.70', '2026-06-04 06:20:53'),
(68, 'P12', 'G48', '0.70', '2026-06-04 06:20:53'),
(69, 'P13', 'G09', '0.50', '2026-06-04 06:21:00'),
(70, 'P13', 'G14', '0.50', '2026-06-04 06:21:00'),
(71, 'P13', 'G35', '0.50', '2026-06-04 06:21:00'),
(72, 'P14', 'G10', '0.50', '2026-06-04 06:21:09'),
(73, 'P14', 'G22', '0.50', '2026-06-04 06:21:09'),
(74, 'P14', 'G45', '0.50', '2026-06-04 06:21:09'),
(75, 'P15', 'G17', '0.50', '2026-06-04 06:21:17'),
(76, 'P15', 'G29', '0.50', '2026-06-04 06:21:17'),
(77, 'P15', 'G31', '0.50', '2026-06-04 06:21:17'),
(78, 'P15', 'G48', '0.50', '2026-06-04 06:21:17'),
(79, 'P16', 'G11', '0.50', '2026-06-04 06:21:26'),
(80, 'P16', 'G39', '0.50', '2026-06-04 06:21:26'),
(81, 'P16', 'G40', '0.50', '2026-06-04 06:21:26'),
(82, 'P17', 'G03', '0.50', '2026-06-04 06:21:38'),
(83, 'P17', 'G33', '0.50', '2026-06-04 06:21:38'),
(84, 'P17', 'G34', '0.50', '2026-06-04 06:21:38'),
(85, 'P17', 'G50', '0.50', '2026-06-04 06:21:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `gejala`
--
ALTER TABLE `gejala`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `penyebab`
--
ALTER TABLE `penyebab`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rules`
--
ALTER TABLE `rules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_rules_penyebab` (`penyebab_id`),
  ADD KEY `fk_rules_gejala` (`gejala_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `rules`
--
ALTER TABLE `rules`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `rules`
--
ALTER TABLE `rules`
  ADD CONSTRAINT `fk_rules_gejala` FOREIGN KEY (`gejala_id`) REFERENCES `gejala` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_rules_penyebab` FOREIGN KEY (`penyebab_id`) REFERENCES `penyebab` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
