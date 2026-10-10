-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: nhatro
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `province` varchar(100) NOT NULL,
  `district` varchar(100) DEFAULT NULL,
  `province_code` int unsigned DEFAULT NULL,
  `ward_code` int unsigned DEFAULT NULL,
  `ward` varchar(100) DEFAULT NULL,
  `street_address` varchar(255) DEFAULT NULL,
  `formatted_address` varchar(500) DEFAULT NULL,
  `vietmap_ref_id` varchar(500) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `location_source` enum('manual','vietmap') NOT NULL DEFAULT 'manual',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_addresses_ward_code` (`ward_code`),
  KEY `idx_addresses_coordinates` (`latitude`,`longitude`),
  KEY `idx_addresses_vietmap_ref` (`vietmap_ref_id`(191))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,'Hà Nội','Thạch Thất',NULL,NULL,'Tân Xã',NULL,'Tân Xã, Thạch Thất, Hà Nội',NULL,21.0147000,105.5265000,'manual','2026-09-27 16:36:10','2026-10-07 13:30:59'),(2,'Hà Nội','Thạch Thất',NULL,NULL,'Thạch Hòa',NULL,'Thạch Hòa, Thạch Thất, Hà Nội',NULL,21.0069000,105.5412000,'manual','2026-09-27 16:36:10','2026-10-07 13:30:59'),(3,'Hà Nội','Thạch Thất',NULL,NULL,'Thạch Thất',NULL,'Thạch Thất, Hà Nội',NULL,21.0282000,105.5815000,'manual','2026-09-27 16:36:10','2026-10-07 13:30:59'),(10,'Thành phố Hà Nội',NULL,1,226,'Phường Văn Miếu - Quốc Tử Giám',NULL,NULL,NULL,NULL,NULL,'manual','2026-09-27 20:36:37','2026-10-07 13:24:59'),(11,'Thành phố Hà Nội',NULL,1,4,'Phường Ba Đình',NULL,NULL,NULL,NULL,NULL,'manual','2026-09-27 21:21:49','2026-10-07 13:24:59');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `table_name` varchar(64) NOT NULL,
  `record_id` bigint unsigned NOT NULL,
  `action` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `changed_by` bigint unsigned DEFAULT NULL,
  `old_data` json DEFAULT NULL,
  `new_data` json DEFAULT NULL,
  `changed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_table_record` (`table_name`,`record_id`),
  KEY `idx_audit_changed_at` (`changed_at`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'users',1,'INSERT',NULL,NULL,'{\"role\": \"admin\", \"email\": \"admin@nhatro.vn\", \"status\": \"active\", \"full_name\": \"Nguyễn Văn Admin\"}','2026-09-21 07:37:49'),(2,'users',2,'INSERT',NULL,NULL,'{\"role\": \"landlord\", \"email\": \"lan.tran@nhatro.vn\", \"status\": \"active\", \"full_name\": \"Trần Thị Lan\"}','2026-09-21 07:37:49'),(3,'users',3,'INSERT',NULL,NULL,'{\"role\": \"landlord\", \"email\": \"hung.pham@nhatro.vn\", \"status\": \"active\", \"full_name\": \"Phạm Văn Hùng\"}','2026-09-21 07:37:49'),(4,'users',4,'INSERT',NULL,NULL,'{\"role\": \"tenant\", \"email\": \"mai.le@gmail.com\", \"status\": \"active\", \"full_name\": \"Lê Thị Mai\"}','2026-09-21 07:37:49'),(5,'users',5,'INSERT',NULL,NULL,'{\"role\": \"tenant\", \"email\": \"nam.hoang@gmail.com\", \"status\": \"active\", \"full_name\": \"Hoàng Văn Nam\"}','2026-09-21 07:37:49'),(6,'users',6,'INSERT',NULL,NULL,'{\"role\": \"tenant\", \"email\": \"hoa.do@gmail.com\", \"status\": \"locked\", \"full_name\": \"Đỗ Thị Hoa\"}','2026-09-21 07:37:49'),(7,'room_listings',1,'INSERT',NULL,NULL,'{\"title\": \"Phòng trọ full nội thất gần ĐH Kinh tế\", \"status\": \"available\", \"price_per_month\": 3000000.00}','2026-09-21 07:37:49'),(8,'room_listings',2,'INSERT',NULL,NULL,'{\"title\": \"Phòng trọ mới xây, có thang máy\", \"status\": \"available\", \"price_per_month\": 4500000.00}','2026-09-21 07:37:49'),(9,'room_listings',3,'INSERT',NULL,NULL,'{\"title\": \"Phòng trọ sinh viên giá rẻ Cầu Giấy\", \"status\": \"rented\", \"price_per_month\": 2200000.00}','2026-09-21 07:37:49'),(10,'room_listings',4,'INSERT',NULL,NULL,'{\"title\": \"Phòng trọ ban công thoáng mát\", \"status\": \"hidden\", \"price_per_month\": 3500000.00}','2026-09-21 07:37:49'),(11,'room_pass_listings',1,'INSERT',NULL,NULL,'{\"title\": \"Pass phòng trọ Cầu Giấy giá tốt, còn hợp đồng 6 tháng\", \"status\": \"active\", \"monthly_price\": 2200000.00}','2026-09-21 07:37:49'),(12,'room_pass_listings',2,'INSERT',NULL,NULL,'{\"title\": \"Sang phòng trọ Láng, Đống Đa, dọn vào ở ngay\", \"status\": \"active\", \"monthly_price\": 2800000.00}','2026-09-21 07:37:49'),(13,'roommate_listings',1,'INSERT',NULL,NULL,'{\"title\": \"Có phòng trống, tìm nữ ở ghép Cầu Giấy\", \"status\": \"active\", \"room_type\": \"has_room\"}','2026-09-21 07:37:49'),(14,'roommate_listings',2,'INSERT',NULL,NULL,'{\"title\": \"Tìm phòng + người ở ghép khu Đống Đa\", \"status\": \"active\", \"room_type\": \"looking_for_room\"}','2026-09-21 07:37:49'),(15,'roommate_listings',3,'INSERT',NULL,NULL,'{\"title\": \"Ở ghép quận 1, cần bạn nam cùng chia phòng\", \"status\": \"closed\", \"room_type\": \"has_room\"}','2026-09-21 07:37:49'),(16,'vehicle_bookings',1,'INSERT',NULL,NULL,'{\"status\": \"confirmed\", \"renter_id\": 4, \"vehicle_id\": 1, \"total_price\": 600000.00}','2026-09-21 07:37:49'),(17,'vehicle_bookings',2,'INSERT',NULL,NULL,'{\"status\": \"completed\", \"renter_id\": 6, \"vehicle_id\": 3, \"total_price\": 120000.00}','2026-09-21 07:37:49'),(18,'vehicle_bookings',3,'INSERT',NULL,NULL,'{\"status\": \"pending\", \"renter_id\": 5, \"vehicle_id\": 2, \"total_price\": null}','2026-09-21 07:37:49'),(19,'users',7,'INSERT',NULL,NULL,'{\"role\": \"tenant\", \"email\": \"ducbaonguyen508@gmail.com\", \"status\": \"active\", \"full_name\": \"nguyen ducbao\"}','2026-09-21 09:26:38'),(20,'users',8,'INSERT',NULL,NULL,'{\"role\": \"tenant\", \"email\": \"nguyenducbao173@gmail.com\", \"status\": \"active\", \"full_name\": \"Đức Bảo Nguyễn\"}','2026-09-21 15:32:12'),(21,'vehicle_bookings',1,'DELETE',NULL,'{\"status\": \"confirmed\", \"renter_id\": 4, \"vehicle_id\": 1, \"total_price\": 600000.00}',NULL,'2026-09-27 16:35:29'),(22,'vehicle_bookings',2,'DELETE',NULL,'{\"status\": \"completed\", \"renter_id\": 6, \"vehicle_id\": 3, \"total_price\": 120000.00}',NULL,'2026-09-27 16:35:29'),(23,'vehicle_bookings',3,'DELETE',NULL,'{\"status\": \"pending\", \"renter_id\": 5, \"vehicle_id\": 2, \"total_price\": null}',NULL,'2026-09-27 16:35:29'),(24,'roommate_listings',1,'DELETE',NULL,'{\"title\": \"Có phòng trống, tìm nữ ở ghép Cầu Giấy\", \"status\": \"active\", \"room_type\": \"has_room\"}',NULL,'2026-09-27 16:35:29'),(25,'roommate_listings',2,'DELETE',NULL,'{\"title\": \"Tìm phòng + người ở ghép khu Đống Đa\", \"status\": \"active\", \"room_type\": \"looking_for_room\"}',NULL,'2026-09-27 16:35:29'),(26,'roommate_listings',3,'DELETE',NULL,'{\"title\": \"Ở ghép quận 1, cần bạn nam cùng chia phòng\", \"status\": \"closed\", \"room_type\": \"has_room\"}',NULL,'2026-09-27 16:35:29'),(27,'room_pass_listings',1,'DELETE',NULL,'{\"title\": \"Pass phòng trọ Cầu Giấy giá tốt, còn hợp đồng 6 tháng\", \"status\": \"active\", \"monthly_price\": 2200000.00}',NULL,'2026-09-27 16:35:29'),(28,'room_pass_listings',2,'DELETE',NULL,'{\"title\": \"Sang phòng trọ Láng, Đống Đa, dọn vào ở ngay\", \"status\": \"active\", \"monthly_price\": 2800000.00}',NULL,'2026-09-27 16:35:29'),(29,'room_listings',1,'DELETE',NULL,'{\"title\": \"Phòng trọ full nội thất gần ĐH Kinh tế\", \"status\": \"available\", \"price_per_month\": 3000000.00}',NULL,'2026-09-27 16:35:29'),(30,'room_listings',2,'DELETE',NULL,'{\"title\": \"Phòng trọ mới xây, có thang máy\", \"status\": \"available\", \"price_per_month\": 4500000.00}',NULL,'2026-09-27 16:35:29'),(31,'room_listings',3,'DELETE',NULL,'{\"title\": \"Phòng trọ sinh viên giá rẻ Cầu Giấy\", \"status\": \"rented\", \"price_per_month\": 2200000.00}',NULL,'2026-09-27 16:35:29'),(32,'room_listings',4,'DELETE',NULL,'{\"title\": \"Phòng trọ ban công thoáng mát\", \"status\": \"hidden\", \"price_per_month\": 3500000.00}',NULL,'2026-09-27 16:35:29'),(33,'room_listings',1,'INSERT',NULL,NULL,'{\"title\": \"Phòng trọ full nội thất gần khu dịch vụ Tân Xã\", \"status\": \"available\", \"price_per_month\": 1800000.00}','2026-09-27 16:36:10'),(34,'room_listings',2,'INSERT',NULL,NULL,'{\"title\": \"Phòng trọ mới xây, an ninh 24/7\", \"status\": \"available\", \"price_per_month\": 2300000.00}','2026-09-27 16:36:10'),(35,'room_listings',3,'INSERT',NULL,NULL,'{\"title\": \"Phòng trọ giá rẻ cho sinh viên\", \"status\": \"rented\", \"price_per_month\": 1500000.00}','2026-09-27 16:36:10'),(36,'room_listings',4,'INSERT',NULL,NULL,'{\"title\": \"Phòng trọ ban công thoáng mát\", \"status\": \"hidden\", \"price_per_month\": 2100000.00}','2026-09-27 16:36:10'),(37,'room_pass_listings',1,'INSERT',NULL,NULL,'{\"title\": \"Pass phòng trọ giá sinh viên, còn hợp đồng 6 tháng\", \"status\": \"active\", \"monthly_price\": 1500000.00}','2026-09-27 16:36:10'),(38,'room_pass_listings',2,'INSERT',NULL,NULL,'{\"title\": \"Pass gấp phòng trọ gần trường, giá tốt\", \"status\": \"urgent\", \"monthly_price\": 1600000.00}','2026-09-27 16:36:10'),(39,'room_pass_listings',3,'INSERT',NULL,NULL,'{\"title\": \"Sang nhượng hợp đồng chung cư mini Tân Xã\", \"status\": \"active\", \"monthly_price\": 2300000.00}','2026-09-27 16:36:10'),(40,'roommate_listings',1,'INSERT',NULL,NULL,'{\"title\": \"Có phòng trống, tìm nữ ở ghép Thạch Thất\", \"status\": \"active\", \"room_type\": \"has_room\"}','2026-09-27 16:36:10'),(41,'roommate_listings',2,'INSERT',NULL,NULL,'{\"title\": \"Tìm phòng + người ở ghép khu Thạch Hòa\", \"status\": \"active\", \"room_type\": \"looking_for_room\"}','2026-09-27 16:36:10'),(42,'roommate_listings',3,'INSERT',NULL,NULL,'{\"title\": \"Ở ghép Tân Xã, cần bạn nam cùng chia phòng\", \"status\": \"closed\", \"room_type\": \"has_room\"}','2026-09-27 16:36:10'),(43,'item_listings',1,'INSERT',NULL,NULL,'{\"price\": 350000.00, \"title\": \"Bàn học gỗ + ghế xoay, còn mới 90%\", \"status\": \"available\"}','2026-09-27 16:36:10'),(44,'item_listings',2,'INSERT',NULL,NULL,'{\"price\": 180000.00, \"title\": \"Quạt điện Panasonic 3 tốc độ\", \"status\": \"urgent\"}','2026-09-27 16:36:10'),(45,'item_listings',3,'INSERT',NULL,NULL,'{\"price\": 150000.00, \"title\": \"Tủ nhựa 5 tầng đựng quần áo\", \"status\": \"available\"}','2026-09-27 16:36:10'),(46,'item_listings',4,'INSERT',NULL,NULL,'{\"price\": 250000.00, \"title\": \"Nồi cơm điện Sharp 1.8L\", \"status\": \"urgent\"}','2026-09-27 16:36:10'),(47,'item_listings',5,'INSERT',NULL,NULL,'{\"price\": 600000.00, \"title\": \"Xe đạp cào cào cho sinh viên\", \"status\": \"available\"}','2026-09-27 16:36:10'),(48,'item_listings',6,'INSERT',NULL,NULL,'{\"price\": 120000.00, \"title\": \"Bộ giáo trình Đại học Kinh tế năm 2\", \"status\": \"available\"}','2026-09-27 16:36:10'),(49,'vehicle_bookings',1,'INSERT',NULL,NULL,'{\"status\": \"confirmed\", \"renter_id\": 4, \"vehicle_id\": 1, \"total_price\": 600000.00}','2026-09-27 16:36:10'),(50,'vehicle_bookings',2,'INSERT',NULL,NULL,'{\"status\": \"completed\", \"renter_id\": 6, \"vehicle_id\": 3, \"total_price\": 120000.00}','2026-09-27 16:36:10'),(51,'vehicle_bookings',3,'INSERT',NULL,NULL,'{\"status\": \"pending\", \"renter_id\": 5, \"vehicle_id\": 2, \"total_price\": null}','2026-09-27 16:36:10'),(52,'item_listings',7,'INSERT',NULL,NULL,'{\"price\": 200000.00, \"title\": \"Test bàn ủi hơi nước\", \"status\": \"pending\"}','2026-09-27 16:48:06'),(53,'item_listings',8,'INSERT',NULL,NULL,'{\"price\": 200000.00, \"title\": \"Test bàn ủi hơi nước\", \"status\": \"pending\"}','2026-09-27 16:49:48'),(54,'item_listings',9,'INSERT',NULL,NULL,'{\"price\": 200000.00, \"title\": \"Test bàn ủi hơi nước (không ảnh)\", \"status\": \"pending\"}','2026-09-27 16:50:04'),(55,'roommate_listings',4,'INSERT',NULL,NULL,'{\"title\": \"Test tìm roommate qua API\", \"status\": \"active\", \"room_type\": \"has_room\"}','2026-09-27 16:50:43'),(56,'room_pass_listings',4,'INSERT',NULL,NULL,'{\"title\": \"Test pass phòng qua API\", \"status\": \"pending\", \"monthly_price\": 1700000.00}','2026-09-27 16:50:43'),(57,'item_listings',9,'UPDATE',NULL,'{\"price\": 200000.00, \"title\": \"Test bàn ủi hơi nước (không ảnh)\", \"status\": \"pending\"}','{\"price\": 200000.00, \"title\": \"Test bàn ủi hơi nước (không ảnh)\", \"status\": \"available\"}','2026-09-27 16:51:11'),(58,'room_pass_listings',4,'UPDATE',NULL,'{\"title\": \"Test pass phòng qua API\", \"status\": \"pending\", \"monthly_price\": 1700000.00}','{\"title\": \"Test pass phòng qua API\", \"status\": \"active\", \"monthly_price\": 1700000.00}','2026-09-27 16:51:30'),(59,'vehicle_bookings',4,'INSERT',NULL,NULL,'{\"status\": \"pending\", \"renter_id\": 4, \"vehicle_id\": 1, \"total_price\": 400000.00}','2026-09-27 16:51:30'),(60,'vehicle_bookings',4,'DELETE',NULL,'{\"status\": \"pending\", \"renter_id\": 4, \"vehicle_id\": 1, \"total_price\": 400000.00}',NULL,'2026-09-27 16:51:40'),(61,'room_pass_listings',4,'DELETE',NULL,'{\"title\": \"Test pass phòng qua API\", \"status\": \"active\", \"monthly_price\": 1700000.00}',NULL,'2026-09-27 16:51:40'),(62,'item_listings',9,'DELETE',NULL,'{\"price\": 200000.00, \"title\": \"Test bàn ủi hơi nước (không ảnh)\", \"status\": \"available\"}',NULL,'2026-09-27 16:51:40'),(63,'roommate_listings',4,'DELETE',NULL,'{\"title\": \"Test tìm roommate qua API\", \"status\": \"active\", \"room_type\": \"has_room\"}',NULL,'2026-09-27 16:51:40'),(64,'item_listings',7,'DELETE',NULL,'{\"price\": 200000.00, \"title\": \"Test bàn ủi hơi nước\", \"status\": \"pending\"}',NULL,'2026-09-27 16:52:18'),(65,'item_listings',8,'DELETE',NULL,'{\"price\": 200000.00, \"title\": \"Test bàn ủi hơi nước\", \"status\": \"pending\"}',NULL,'2026-09-27 16:52:18'),(66,'users',1,'UPDATE',NULL,'{\"role\": \"admin\", \"email\": \"admin@nhatro.vn\", \"status\": \"active\", \"full_name\": \"Nguyễn Văn Admin\"}','{\"role\": \"admin\", \"email\": \"admin@nhatro.vn\", \"status\": \"active\", \"full_name\": \"Nguyễn Văn Admin\"}','2026-09-27 17:24:09'),(67,'users',2,'UPDATE',NULL,'{\"role\": \"landlord\", \"email\": \"lan.tran@nhatro.vn\", \"status\": \"active\", \"full_name\": \"Trần Thị Lan\"}','{\"role\": \"landlord\", \"email\": \"lan.tran@nhatro.vn\", \"status\": \"active\", \"full_name\": \"Trần Thị Lan\"}','2026-09-27 18:27:01'),(68,'users',3,'UPDATE',NULL,'{\"role\": \"landlord\", \"email\": \"hung.pham@nhatro.vn\", \"status\": \"active\", \"full_name\": \"Phạm Văn Hùng\"}','{\"role\": \"landlord\", \"email\": \"hung.pham@nhatro.vn\", \"status\": \"active\", \"full_name\": \"Phạm Văn Hùng\"}','2026-09-27 18:27:03'),(69,'users',4,'UPDATE',NULL,'{\"role\": \"tenant\", \"email\": \"mai.le@gmail.com\", \"status\": \"active\", \"full_name\": \"Lê Thị Mai\"}','{\"role\": \"tenant\", \"email\": \"mai.le@gmail.com\", \"status\": \"active\", \"full_name\": \"Lê Thị Mai\"}','2026-09-27 18:27:05'),(70,'users',9,'INSERT',NULL,NULL,'{\"role\": \"landlord\", \"email\": \"test.landlord.maps@example.com\", \"status\": \"active\", \"full_name\": \"Test Landlord Maps\"}','2026-09-27 19:07:13'),(71,'room_listings',5,'INSERT',NULL,NULL,'{\"title\": \"Ph�ng test t�ch h?p Maps\", \"status\": \"available\", \"price_per_month\": 2000000.00}','2026-09-27 19:07:29'),(72,'room_listings',6,'INSERT',NULL,NULL,'{\"title\": \"Phòng test UTF-8 rõ ràng\", \"status\": \"available\", \"price_per_month\": 2000000.00}','2026-09-27 19:09:23'),(73,'roommate_listings',4,'INSERT',NULL,NULL,'{\"title\": \"Test roommate backward-compat\", \"status\": \"active\", \"room_type\": \"looking_for_room\"}','2026-09-27 19:10:20'),(74,'room_listings',5,'DELETE',NULL,'{\"title\": \"Ph�ng test t�ch h?p Maps\", \"status\": \"available\", \"price_per_month\": 2000000.00}',NULL,'2026-09-27 19:11:14'),(75,'room_listings',6,'DELETE',NULL,'{\"title\": \"Phòng test UTF-8 rõ ràng\", \"status\": \"available\", \"price_per_month\": 2000000.00}',NULL,'2026-09-27 19:11:14'),(76,'roommate_listings',4,'DELETE',NULL,'{\"title\": \"Test roommate backward-compat\", \"status\": \"active\", \"room_type\": \"looking_for_room\"}',NULL,'2026-09-27 19:11:14'),(77,'users',9,'DELETE',NULL,'{\"role\": \"landlord\", \"email\": \"test.landlord.maps@example.com\", \"status\": \"active\", \"full_name\": \"Test Landlord Maps\"}',NULL,'2026-09-27 19:11:14'),(78,'users',10,'INSERT',NULL,NULL,'{\"role\": \"landlord\", \"email\": \"test.landlord.1790540708420@example.com\", \"status\": \"active\", \"full_name\": \"Landlord E2E Test\"}','2026-09-27 20:25:10'),(79,'room_listings',7,'INSERT',NULL,NULL,'{\"title\": \"Phòng test E2E Playwright\", \"status\": \"available\", \"price_per_month\": 2500000.00}','2026-09-27 20:25:45'),(80,'room_listings',7,'DELETE',NULL,'{\"title\": \"Phòng test E2E Playwright\", \"status\": \"available\", \"price_per_month\": 2500000.00}',NULL,'2026-09-27 20:27:21'),(81,'users',10,'DELETE',NULL,'{\"role\": \"landlord\", \"email\": \"test.landlord.1790540708420@example.com\", \"status\": \"active\", \"full_name\": \"Landlord E2E Test\"}',NULL,'2026-09-27 20:27:21'),(82,'room_listings',8,'INSERT',NULL,NULL,'{\"title\": \"Phòng trọ trung tâm hn\", \"status\": \"available\", \"price_per_month\": 1800000.00}','2026-09-27 20:36:37'),(83,'users',11,'INSERT',NULL,NULL,'{\"role\": \"tenant\", \"email\": \"e2e.poster@example.com\", \"status\": \"active\", \"full_name\": \"E2E poster\"}','2026-09-27 21:19:55'),(84,'users',12,'INSERT',NULL,NULL,'{\"role\": \"tenant\", \"email\": \"e2e.viewer@example.com\", \"status\": \"active\", \"full_name\": \"E2E viewer\"}','2026-09-27 21:19:55'),(85,'roommate_listings',5,'INSERT',NULL,NULL,'{\"title\": \"E2E - Tìm bạn ở ghép phòng 25m2\", \"status\": \"active\", \"room_type\": \"looking_for_room\"}','2026-09-27 21:21:49'),(86,'item_listings',7,'INSERT',NULL,NULL,'{\"price\": 350000.00, \"title\": \"E2E - Bàn học gỗ + ghế xoay\", \"status\": \"pending\"}','2026-09-27 21:21:51'),(87,'room_pass_listings',4,'INSERT',NULL,NULL,'{\"title\": \"E2E - Pass phòng 25m2 full nội thất\", \"status\": \"pending\", \"monthly_price\": 2500000.00}','2026-09-27 21:21:52'),(88,'roommate_listings',6,'INSERT',NULL,NULL,'{\"title\": \"E2E - Tìm bạn ở ghép phòng 25m2\", \"status\": \"active\", \"room_type\": \"looking_for_room\"}','2026-09-27 21:22:54'),(89,'item_listings',8,'INSERT',NULL,NULL,'{\"price\": 350000.00, \"title\": \"E2E - Bàn học gỗ + ghế xoay\", \"status\": \"pending\"}','2026-09-27 21:22:55'),(90,'room_pass_listings',5,'INSERT',NULL,NULL,'{\"title\": \"E2E - Pass phòng 25m2 full nội thất\", \"status\": \"pending\", \"monthly_price\": 2500000.00}','2026-09-27 21:22:56'),(91,'roommate_listings',5,'DELETE',NULL,'{\"title\": \"E2E - Tìm bạn ở ghép phòng 25m2\", \"status\": \"active\", \"room_type\": \"looking_for_room\"}',NULL,'2026-09-27 21:23:38'),(92,'roommate_listings',6,'DELETE',NULL,'{\"title\": \"E2E - Tìm bạn ở ghép phòng 25m2\", \"status\": \"active\", \"room_type\": \"looking_for_room\"}',NULL,'2026-09-27 21:23:38'),(93,'item_listings',7,'DELETE',NULL,'{\"price\": 350000.00, \"title\": \"E2E - Bàn học gỗ + ghế xoay\", \"status\": \"pending\"}',NULL,'2026-09-27 21:23:38'),(94,'item_listings',8,'DELETE',NULL,'{\"price\": 350000.00, \"title\": \"E2E - Bàn học gỗ + ghế xoay\", \"status\": \"pending\"}',NULL,'2026-09-27 21:23:38'),(95,'room_pass_listings',4,'DELETE',NULL,'{\"title\": \"E2E - Pass phòng 25m2 full nội thất\", \"status\": \"pending\", \"monthly_price\": 2500000.00}',NULL,'2026-09-27 21:23:38'),(96,'room_pass_listings',5,'DELETE',NULL,'{\"title\": \"E2E - Pass phòng 25m2 full nội thất\", \"status\": \"pending\", \"monthly_price\": 2500000.00}',NULL,'2026-09-27 21:23:38'),(97,'users',11,'DELETE',NULL,'{\"role\": \"tenant\", \"email\": \"e2e.poster@example.com\", \"status\": \"active\", \"full_name\": \"E2E poster\"}',NULL,'2026-09-27 21:23:38'),(98,'users',12,'DELETE',NULL,'{\"role\": \"tenant\", \"email\": \"e2e.viewer@example.com\", \"status\": \"active\", \"full_name\": \"E2E viewer\"}',NULL,'2026-09-27 21:23:38'),(99,'users',4,'UPDATE',NULL,'{\"role\": \"tenant\", \"email\": \"mai.le@gmail.com\", \"status\": \"active\", \"full_name\": \"Lê Thị Mai\"}','{\"role\": \"tenant\", \"email\": \"mai.le@gmail.com\", \"status\": \"active\", \"full_name\": \"Lê Thị Mai\"}','2026-09-29 06:58:42'),(100,'users',13,'INSERT',NULL,NULL,'{\"role\": \"tenant\", \"email\": \"qa-test-settings@example.com\", \"status\": \"active\", \"full_name\": \"Test QA\"}','2026-09-29 08:24:13'),(101,'room_listings',9,'INSERT',NULL,NULL,'{\"title\": \"QA test room\", \"status\": \"available\", \"price_per_month\": 1000000.00}','2026-09-29 08:25:14'),(104,'item_listings',9,'INSERT',NULL,NULL,'{\"price\": 100000.00, \"title\": \"QA test item\", \"status\": \"pending\"}','2026-09-29 08:25:38'),(107,'item_listings',9,'DELETE',NULL,'{\"price\": 100000.00, \"title\": \"QA test item\", \"status\": \"sold\"}',NULL,'2026-09-29 08:26:21'),(108,'room_listings',9,'DELETE',NULL,'{\"title\": \"QA test room updated\", \"status\": \"rented\", \"price_per_month\": 1800000.00}',NULL,'2026-09-29 08:26:21'),(109,'users',13,'DELETE',NULL,'{\"role\": \"tenant\", \"email\": \"qa-test-settings@example.com\", \"status\": \"active\", \"full_name\": \"Test QA\"}',NULL,'2026-09-29 08:26:21'),(110,'room_pass_listings',1,'UPDATE',4,'{\"title\": \"Pass phòng trọ giá sinh viên, còn hợp đồng 6 tháng\", \"status\": \"active\", \"monthly_price\": 1500000.00}','{\"title\": \"Pass phòng trọ giá sinh viên, còn hợp đồng 6 tháng\", \"status\": \"cancelled\", \"monthly_price\": 1500000.00}','2026-09-29 08:30:10'),(111,'users',4,'UPDATE',NULL,'{\"role\": \"tenant\", \"email\": \"mai.le@gmail.com\", \"status\": \"active\", \"full_name\": \"Lê Thị Mai\"}','{\"role\": \"tenant\", \"email\": \"mai.le@gmail.com\", \"status\": \"active\", \"full_name\": \"Lê Thị Mai\"}','2026-10-09 20:26:46');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `listing_type` enum('room','roommate','pass_room','item','vehicle') NOT NULL DEFAULT 'room',
  `listing_id` bigint unsigned NOT NULL,
  `owner_id` bigint unsigned NOT NULL,
  `inquirer_id` bigint unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_listing_inquirer` (`listing_type`,`listing_id`,`inquirer_id`),
  KEY `idx_conversation_owner` (`owner_id`),
  KEY `idx_conversation_inquirer` (`inquirer_id`),
  CONSTRAINT `fk_conversation_inquirer` FOREIGN KEY (`inquirer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_conversation_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
INSERT INTO `conversations` VALUES (1,'room',1,2,4,'2026-09-28 01:08:02','2026-09-28 03:30:43'),(2,'room',1,2,1,'2026-09-28 01:22:40','2026-09-28 03:30:36'),(5,'roommate',1,4,1,'2026-09-29 12:52:40','2026-09-29 12:52:40'),(6,'vehicle',1,3,1,'2026-09-29 12:52:54','2026-09-29 12:52:54'),(7,'item',1,4,1,'2026-09-29 12:53:01','2026-09-29 12:53:08'),(8,'item',5,6,4,'2026-09-29 14:58:05','2026-09-29 14:58:05'),(9,'pass_room',3,5,4,'2026-09-29 15:30:26','2026-09-29 15:30:26'),(10,'room',2,2,8,'2026-10-07 20:30:10','2026-10-07 20:30:10'),(11,'room',8,2,8,'2026-10-08 00:22:39','2026-10-08 00:22:39'),(12,'pass_room',3,5,8,'2026-10-08 00:29:12','2026-10-08 21:04:49'),(13,'roommate',1,4,8,'2026-10-08 00:57:14','2026-10-08 01:09:52'),(14,'room',1,2,8,'2026-10-08 01:19:36','2026-10-10 02:40:19'),(15,'item',1,4,8,'2026-10-08 01:20:29','2026-10-08 01:21:02'),(16,'roommate',2,6,2,'2026-10-10 02:43:07','2026-10-10 02:43:29');
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `entity_type` enum('room','roommate','pass_room','item','vehicle') NOT NULL,
  `entity_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_favorite` (`user_id`,`entity_type`,`entity_id`),
  CONSTRAINT `fk_favorite_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (2,5,'pass_room',1,'2026-09-27 16:36:10'),(3,6,'vehicle',1,'2026-09-27 16:36:10'),(4,6,'roommate',1,'2026-09-27 16:36:10'),(14,8,'pass_room',3,'2026-10-08 14:04:45');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_images`
--

DROP TABLE IF EXISTS `item_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `item_listing_id` bigint unsigned NOT NULL,
  `media_url` varchar(255) NOT NULL,
  `media_type` enum('image','video') NOT NULL DEFAULT 'image',
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_item_images_listing` (`item_listing_id`),
  CONSTRAINT `fk_item_images_listing` FOREIGN KEY (`item_listing_id`) REFERENCES `item_listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_images`
--

LOCK TABLES `item_images` WRITE;
/*!40000 ALTER TABLE `item_images` DISABLE KEYS */;
INSERT INTO `item_images` VALUES (1,1,'https://picsum.photos/seed/item1a/800/600','image',1,'2026-09-27 16:36:10'),(2,2,'https://picsum.photos/seed/item2a/800/600','image',1,'2026-09-27 16:36:10'),(3,3,'https://picsum.photos/seed/item3a/800/600','image',1,'2026-09-27 16:36:10'),(4,4,'https://picsum.photos/seed/item4a/800/600','image',1,'2026-09-27 16:36:10'),(5,5,'https://picsum.photos/seed/item5a/800/600','image',1,'2026-09-27 16:36:10'),(6,6,'https://picsum.photos/seed/item6a/800/600','image',1,'2026-09-27 16:36:10');
/*!40000 ALTER TABLE `item_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_listings`
--

DROP TABLE IF EXISTS `item_listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_listings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `posted_by` bigint unsigned NOT NULL,
  `address_id` bigint unsigned NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `category` varchar(50) NOT NULL,
  `item_condition` varchar(50) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `status` enum('pending','available','urgent','sold') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_item_posted_by` (`posted_by`),
  KEY `idx_item_address` (`address_id`),
  KEY `idx_item_status` (`status`),
  CONSTRAINT `fk_item_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `fk_item_user` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_listings`
--

LOCK TABLES `item_listings` WRITE;
/*!40000 ALTER TABLE `item_listings` DISABLE KEYS */;
INSERT INTO `item_listings` VALUES (1,4,1,'Bàn học gỗ + ghế xoay, còn mới 90%','Bàn học gỗ chắc chắn kèm ghế xoay, còn mới, ít trầy xước.','Nội thất','Mới 90%',350000.00,'available','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(2,6,2,'Quạt điện Panasonic 3 tốc độ','Quạt chạy êm, đủ 3 tốc độ, cần bán gấp do chuyển đi.','Đồ điện tử','Đã dùng',180000.00,'urgent','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(3,5,1,'Tủ nhựa 5 tầng đựng quần áo','Tủ nhựa 5 tầng, còn chắc chắn, phù hợp phòng trọ nhỏ.','Nội thất','Đã dùng',150000.00,'available','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(4,4,3,'Nồi cơm điện Sharp 1.8L','Nồi cơm điện dung tích 1.8L, còn mới 95%, cần bán gấp.','Đồ gia dụng','Mới 95%',250000.00,'urgent','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(5,6,1,'Xe đạp cào cào cho sinh viên','Xe đạp còn chạy tốt, phù hợp di chuyển gần trong khu vực.','Xe cộ','Đã dùng',600000.00,'available','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(6,5,2,'Bộ giáo trình Đại học Kinh tế năm 2','Đầy đủ giáo trình năm 2, còn sạch, không ghi chú nhiều.','Sách - Giáo trình','Đã dùng',120000.00,'available','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL);
/*!40000 ALTER TABLE `item_listings` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_item_listings_after_insert` AFTER INSERT ON `item_listings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, new_data)
  VALUES ('item_listings', NEW.id, 'INSERT', @app_user_id,
    JSON_OBJECT('title', NEW.title, 'price', NEW.price, 'status', NEW.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_item_listings_after_update` AFTER UPDATE ON `item_listings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data, new_data)
  VALUES ('item_listings', NEW.id, 'UPDATE', @app_user_id,
    JSON_OBJECT('title', OLD.title, 'price', OLD.price, 'status', OLD.status),
    JSON_OBJECT('title', NEW.title, 'price', NEW.price, 'status', NEW.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_item_listings_after_delete` AFTER DELETE ON `item_listings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data)
  VALUES ('item_listings', OLD.id, 'DELETE', @app_user_id,
    JSON_OBJECT('title', OLD.title, 'price', OLD.price, 'status', OLD.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `listing_payments`
--

DROP TABLE IF EXISTS `listing_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing_payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `txn_ref` varchar(100) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `provider` enum('vnpay') NOT NULL DEFAULT 'vnpay',
  `status` enum('pending','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  `provider_transaction` varchar(100) DEFAULT NULL,
  `response_code` varchar(10) DEFAULT NULL,
  `paid_at` datetime DEFAULT NULL,
  `consumed_at` datetime DEFAULT NULL,
  `listing_type` enum('room','roommate','pass_room','item','vehicle') DEFAULT NULL,
  `listing_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_listing_payment_txn_ref` (`txn_ref`),
  KEY `idx_listing_payment_credit` (`user_id`,`status`,`consumed_at`),
  CONSTRAINT `fk_listing_payment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing_payments`
--

LOCK TABLES `listing_payments` WRITE;
/*!40000 ALTER TABLE `listing_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `listing_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `conversation_id` bigint unsigned NOT NULL,
  `sender_id` bigint unsigned DEFAULT NULL,
  `sender_type` enum('user','ai') NOT NULL DEFAULT 'user',
  `message_kind` enum('chat','ai_question','ai_answer') NOT NULL DEFAULT 'chat',
  `body` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_conversation_created` (`conversation_id`,`created_at`),
  KEY `fk_message_sender` (`sender_id`),
  CONSTRAINT `fk_message_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_message_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (2,1,4,'user','chat','Hello, is the room still available?',1,'2026-09-28 01:09:35'),(5,2,1,'user','chat','hello chị',1,'2026-09-28 01:22:44'),(6,2,2,'user','chat','hi em',1,'2026-09-28 03:30:36'),(7,1,2,'user','chat','yes',0,'2026-09-28 03:30:43'),(9,7,1,'user','chat','bạn ơi hàng này còn không bạn',1,'2026-09-29 12:53:08'),(10,13,8,'user','ai_question','hi bạn',1,'2026-10-08 01:06:23'),(11,13,NULL,'ai','ai_answer','Chào bạn! Mình là trợ lý AI của RentMate Hola. Mình có thể hỗ trợ gì cho bạn về bài đăng tìm người ở ghép tại Thạch Thất? \n\nThông tin cơ bản về phòng hiện tại:\n* **Tiêu đề:** Có phòng trống, tìm nữ ở ghép Thạch Thất\n* **Giá thuê:** 1.300.000 VNĐ/tháng\n* **Diện tích:** 18 m²\n* **Địa chỉ:** Thạch Thất, Hà Nội\n* **Tiện ích:** Full nội thất, có điều hòa, giờ giấc tự do, yêu cầu tìm bạn nữ sạch sẽ, hoà đồng.\n\nNếu bạn quan tâm hoặc cần thêm thông tin chi tiết, bạn hãy nhắn cho mình nhé!',1,'2026-10-08 01:06:23'),(12,13,8,'user','ai_question','có những phòng nào với giá tiền tương tự',1,'2026-10-08 01:06:43'),(13,13,NULL,'ai','ai_answer','Chào bạn, hiện tại hệ thống có một số phòng trọ với mức giá gần tương tự để bạn tham khảo:\n\n* **Phòng trọ full nội thất gần khu dịch vụ Tân Xã**\n  * Giá: 1.800.000 VNĐ/tháng\n  * Diện tích: 25 m²\n  * Địa chỉ: Tân Xã, Hà Nội\n  * [Xem chi tiết](/phong-tro/1)\n\n* **Phòng trọ trung tâm hn**\n  * Giá: 1.800.000 VNĐ/tháng\n  * Diện tích: 25 m²\n  * Địa chỉ: Phường Văn Miếu - Quốc Tử Giám, Thành phố Hà Nội\n  * [Xem chi tiết](/phong-tro/8)\n\n* **Phòng trọ mới xây, an ninh 24/7**\n  * Giá: 2.300.000 VNĐ/tháng\n  * Diện tích: 28 m²\n  * Địa chỉ: Thạch Hòa, Hà Nội\n  * [Xem chi tiết](/phong-tro/2)\n\n*(Lưu ý: Các chi phí khác như điện, nước, dịch vụ... của các phòng này chưa được cập nhật, bạn vui lòng hỏi chủ bài để biết thêm chi tiết nhé).* \n\nBạn có muốn tìm hiểu thêm về phòng nào ở trên không?',1,'2026-10-08 01:06:43'),(14,13,8,'user','ai_question','Hãy tìm tất cả các đồ đang pass trong phần pass đồ',1,'2026-10-08 01:09:52'),(15,13,NULL,'ai','ai_answer','Thông tin này chưa được cập nhật, bạn vui lòng hỏi chủ bài để biết thêm chi tiết nhé!',1,'2026-10-08 01:09:52'),(16,14,8,'user','chat','hi chị',1,'2026-10-08 01:19:39'),(17,12,8,'user','ai_question','hi bạn',1,'2026-10-08 01:20:22'),(18,12,NULL,'ai','ai_answer','Chào bạn! Mình là trợ lý AI của RentMate Hola. Mình có thể giúp gì cho bạn về bài đăng **\"Sang nhượng hợp đồng chung cư mini Tân Xã\"** (ID: 3) với giá 2.300.000 VNĐ/tháng? \n\nBạn cần tìm hiểu thêm thông tin gì về phòng này không?',1,'2026-10-08 01:20:22'),(19,15,8,'user','chat','hi bạn',0,'2026-10-08 01:20:32'),(20,15,8,'user','ai_question','hi bạn',1,'2026-10-08 01:20:45'),(21,15,NULL,'ai','ai_answer','Chào bạn! RentMate Hola rất vui được hỗ trợ bạn. \n\nBạn đang quan tâm đến món đồ nội thất nào dưới đây ạ?\n- **Tên sản phẩm:** Bàn học gỗ + ghế xoay, còn mới 90%\n- **Danh mục:** Nội thất\n- **Tình trạng:** Mới 90%\n- **Giá:** 350.000 VNĐ\n- **Địa chỉ:** Tân Xã, Thạch Thất, Hà Nội\n\nBạn có muốn tìm hiểu thêm chi tiết nào về sản phẩm này không?',1,'2026-10-08 01:20:45'),(22,15,8,'user','ai_question','còn các món đồ nào đang mở pass nữa',1,'2026-10-08 01:21:02'),(23,15,NULL,'ai','ai_answer','Chào bạn, hiện tại hệ thống chỉ đang ghi nhận thông tin về sản phẩm bạn đang xem:\n- **Tên sản phẩm:** Bàn học gỗ + ghế xoay, còn mới 90%\n- **Giá:** 350.000 VNĐ\n- **Tình trạng:** Còn hàng (`available`)\n- **Địa chỉ:** Tân Xã, Thạch Thất, Hà Nội\n\nThông tin về các món đồ khác để pass hiện chưa được cập nhật trong hệ thống. Bạn vui lòng liên hệ trực tiếp với chủ bài đăng để hỏi thêm về các món đồ khác nhé!',1,'2026-10-08 01:21:02'),(24,12,8,'user','chat','hi',0,'2026-10-08 21:04:49'),(25,14,2,'user','ai_question','người dùng này đang hỏi về bài nào',1,'2026-10-10 02:40:19'),(26,14,NULL,'ai','ai_answer','Chào bạn! Người dùng đang hỏi về bài đăng **\"Phòng trọ full nội thất gần khu dịch vụ Tân Xã\"** (ID: 1). \n\nDưới đây là thông tin chi tiết về phòng này:\n* **Giá thuê:** 1.800.000 VNĐ/tháng (Tiền cọc: 1.800.000 VNĐ)\n* **Diện tích:** 25 m²\n* **Địa chỉ:** Tân Xã, Thạch Thất, Hà Nội\n* **Số người tối đa:** 2 người\n* **Tiện ích:** Full nội thất, có điều hòa, giờ giấc tự do\n* **Tình trạng:** Còn phòng (available)\n\nNếu bạn cần tìm kiếm các phòng tương tự, có thể tham khảo:\n* [Phòng trọ trung tâm hn](/phong-tro/8) - Giá: 1.800.000 VNĐ (25 m²)\n* [Phòng trọ mới xây, an ninh 24/7](/phong-tro/2) - Giá: 2.300.000 VNĐ (28 m²)\n\nBạn có muốn hỏi thêm thông tin nào khác không? Nếu có các chi tiết chưa được cập nhật, bạn vui lòng hỏi trực tiếp chủ bài nhé!',1,'2026-10-10 02:40:19'),(27,16,2,'user','chat','hi bạn',0,'2026-10-10 02:43:10'),(28,16,2,'user','ai_question','người này đang ở khu vực nào',1,'2026-10-10 02:43:29'),(29,16,NULL,'ai','ai_answer','Chào bạn! Bài đăng này đang ở khu vực:\n\n* **Khu vực:** Thạch Hòa, Thạch Thất, Hà Nội.\n* **Mô tả:** Người đăng mới chuyển ra Hòa Lạc đi làm và muốn tìm phòng cùng 1-2 bạn ở ghép với ngân sách khoảng 1.200.000 VNĐ/tháng.\n\nNếu bạn cần thêm thông tin chi tiết hoặc muốn liên hệ, vui lòng hỏi trực tiếp chủ bài đăng nhé!',1,'2026-10-10 02:43:29');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reset_user` (`user_id`),
  KEY `idx_reset_token_hash` (`token_hash`),
  CONSTRAINT `fk_reset_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
INSERT INTO `password_reset_tokens` VALUES (1,8,'b589d82e4d8e32f7aac681f4172fb15e1c7a02fe310d19d34c86fce3e2d6fb26','2026-10-07 20:50:44',NULL,'2026-10-07 13:20:43');
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `target_type` enum('room_listing','vehicle','landlord') NOT NULL,
  `target_id` bigint unsigned NOT NULL,
  `rating` tinyint unsigned NOT NULL,
  `comment` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_review_target` (`target_type`,`target_id`),
  KEY `idx_review_user` (`user_id`),
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `chk_review_rating` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,4,'room_listing',1,5,'Phòng đẹp như hình, chủ nhà thân thiện, hỗ trợ nhiệt tình.','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(2,6,'vehicle',3,4,'Vận chuyển nhanh, tài xế nhiệt tình, giá hợp lý.','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(3,5,'landlord',2,5,'Chủ nhà uy tín, sửa chữa đồ hư nhanh chóng.','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(4,4,'landlord',3,4,'Chủ nhà dễ tính, phản hồi nhanh.','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(5,6,'vehicle',1,5,'Xe rộng, tài xế hỗ trợ khuân đồ tận tình.','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_images`
--

DROP TABLE IF EXISTS `room_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `room_listing_id` bigint unsigned NOT NULL,
  `media_url` varchar(255) NOT NULL,
  `media_type` enum('image','video') NOT NULL DEFAULT 'image',
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_room_images_listing` (`room_listing_id`),
  CONSTRAINT `fk_room_images_listing` FOREIGN KEY (`room_listing_id`) REFERENCES `room_listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_images`
--

LOCK TABLES `room_images` WRITE;
/*!40000 ALTER TABLE `room_images` DISABLE KEYS */;
INSERT INTO `room_images` VALUES (1,1,'https://picsum.photos/seed/room1a/800/600','image',1,'2026-09-27 16:36:10'),(2,1,'https://picsum.photos/seed/room1b/800/600','image',0,'2026-09-27 16:36:10'),(3,2,'https://picsum.photos/seed/room2a/800/600','image',1,'2026-09-27 16:36:10'),(4,3,'https://picsum.photos/seed/room3a/800/600','image',1,'2026-09-27 16:36:10'),(5,4,'https://picsum.photos/seed/room4a/800/600','image',1,'2026-09-27 16:36:10'),(6,8,'https://res.cloudinary.com/sb9z4tbj/image/upload/v1790541399/rooms/mwbahlsbakmsfxlvkl9m.png','image',1,'2026-09-27 20:36:39'),(7,8,'https://res.cloudinary.com/sb9z4tbj/image/upload/v1790541399/rooms/hvdyrc3gnz6do8cfyhr1.png','image',0,'2026-09-27 20:36:39'),(8,8,'https://res.cloudinary.com/sb9z4tbj/image/upload/v1790541398/rooms/i0ogsdqbrnid5fbwx2v5.png','image',0,'2026-09-27 20:36:39'),(9,8,'https://res.cloudinary.com/sb9z4tbj/image/upload/v1790541399/rooms/d22veafqoxdabejhwlpl.png','image',0,'2026-09-27 20:36:39');
/*!40000 ALTER TABLE `room_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_inquiries`
--

DROP TABLE IF EXISTS `room_inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_inquiries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `listing_type` enum('room','pass','roommate') NOT NULL,
  `listing_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `message` text,
  `contact_phone` varchar(20) DEFAULT NULL,
  `status` enum('new','contacted','closed') NOT NULL DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_inquiry_listing` (`listing_type`,`listing_id`),
  KEY `idx_inquiry_user` (`user_id`),
  CONSTRAINT `fk_inquiry_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_inquiries`
--

LOCK TABLES `room_inquiries` WRITE;
/*!40000 ALTER TABLE `room_inquiries` DISABLE KEYS */;
INSERT INTO `room_inquiries` VALUES (1,'room',1,5,'Phòng còn không ạ? Cho em xem thêm hình được không?','0911111111','new','2026-09-27 16:36:10','2026-09-27 16:36:10'),(2,'pass',1,6,'Cho em hỏi phí đền bù có thương lượng được không ạ?','0922222222','contacted','2026-09-27 16:36:10','2026-09-27 16:36:10'),(3,'room',3,4,'Phòng này còn trống chưa ạ?','0933333333','closed','2026-09-27 16:36:10','2026-09-27 16:36:10'),(4,'roommate',1,6,'Mình quan tâm, cho mình xin thêm thông tin phòng nhé.','0900000006','new','2026-09-27 16:36:10','2026-09-27 16:36:10');
/*!40000 ALTER TABLE `room_inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_listings`
--

DROP TABLE IF EXISTS `room_listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_listings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `landlord_id` bigint unsigned NOT NULL,
  `address_id` bigint unsigned NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `property_type` enum('phong_tro','chung_cu_mini','nha_nguyen_can') NOT NULL DEFAULT 'phong_tro',
  `price_per_month` decimal(12,2) NOT NULL,
  `deposit_amount` decimal(12,2) DEFAULT NULL,
  `area_m2` decimal(6,2) DEFAULT NULL,
  `max_occupants` smallint unsigned DEFAULT NULL,
  `amenities` json DEFAULT NULL,
  `status` enum('available','rented','hidden') NOT NULL DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_room_landlord` (`landlord_id`),
  KEY `idx_room_address` (`address_id`),
  KEY `idx_room_status` (`status`),
  CONSTRAINT `fk_room_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `fk_room_landlord` FOREIGN KEY (`landlord_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_listings`
--

LOCK TABLES `room_listings` WRITE;
/*!40000 ALTER TABLE `room_listings` DISABLE KEYS */;
INSERT INTO `room_listings` VALUES (1,2,1,'Phòng trọ full nội thất gần khu dịch vụ Tân Xã','Phòng sạch sẽ, có máy lạnh, tủ lạnh, giờ giấc tự do.','phong_tro',1800000.00,1800000.00,25.00,2,'[\"Full nội thất\", \"Có điều hòa\"]','available','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(2,2,2,'Phòng trọ mới xây, an ninh 24/7','Toà nhà mới xây 2025, an ninh 24/7, có thang máy.','chung_cu_mini',2300000.00,2300000.00,28.00,2,'[\"Có gác lửng\", \"Full nội thất\"]','available','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(3,3,3,'Phòng trọ giá rẻ cho sinh viên','Gần các trường đại học, phù hợp sinh viên.','phong_tro',1500000.00,1500000.00,18.00,2,'[\"Full nội thất\"]','rented','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(4,2,1,'Phòng trọ ban công thoáng mát','Có ban công riêng, view thoáng, gần chợ.','nha_nguyen_can',2100000.00,2100000.00,24.00,3,'[\"Có ban công\", \"Có điều hòa\"]','hidden','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(8,2,10,'Phòng trọ trung tâm hn',NULL,'phong_tro',1800000.00,100.00,25.00,5,'[\"WiFi\", \"Bếp\", \"Nội thất\", \"Máy lạnh\"]','available','2026-09-27 20:36:37','2026-09-27 20:36:37',NULL);
/*!40000 ALTER TABLE `room_listings` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_room_listings_after_insert` AFTER INSERT ON `room_listings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, new_data)
  VALUES ('room_listings', NEW.id, 'INSERT', @app_user_id,
    JSON_OBJECT('title', NEW.title, 'price_per_month', NEW.price_per_month, 'status', NEW.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_room_listings_after_update` AFTER UPDATE ON `room_listings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data, new_data)
  VALUES ('room_listings', NEW.id, 'UPDATE', @app_user_id,
    JSON_OBJECT('title', OLD.title, 'price_per_month', OLD.price_per_month, 'status', OLD.status),
    JSON_OBJECT('title', NEW.title, 'price_per_month', NEW.price_per_month, 'status', NEW.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_room_listings_after_delete` AFTER DELETE ON `room_listings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data)
  VALUES ('room_listings', OLD.id, 'DELETE', @app_user_id,
    JSON_OBJECT('title', OLD.title, 'price_per_month', OLD.price_per_month, 'status', OLD.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `room_pass_images`
--

DROP TABLE IF EXISTS `room_pass_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_pass_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `room_pass_listing_id` bigint unsigned NOT NULL,
  `media_url` varchar(255) NOT NULL,
  `media_type` enum('image','video') NOT NULL DEFAULT 'image',
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pass_images_listing` (`room_pass_listing_id`),
  CONSTRAINT `fk_pass_images_listing` FOREIGN KEY (`room_pass_listing_id`) REFERENCES `room_pass_listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_pass_images`
--

LOCK TABLES `room_pass_images` WRITE;
/*!40000 ALTER TABLE `room_pass_images` DISABLE KEYS */;
INSERT INTO `room_pass_images` VALUES (1,1,'https://picsum.photos/seed/pass1a/800/600','image',1,'2026-09-27 16:36:10'),(2,2,'https://picsum.photos/seed/pass2a/800/600','image',1,'2026-09-27 16:36:10'),(3,3,'https://picsum.photos/seed/pass3a/800/600','image',1,'2026-09-27 16:36:10');
/*!40000 ALTER TABLE `room_pass_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_pass_listings`
--

DROP TABLE IF EXISTS `room_pass_listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_pass_listings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `room_listing_id` bigint unsigned DEFAULT NULL,
  `posted_by` bigint unsigned NOT NULL,
  `address_id` bigint unsigned NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `pass_type` enum('pass','transfer') NOT NULL DEFAULT 'pass',
  `property_type` enum('phong_tro','chung_cu_mini','nha_nguyen_can') DEFAULT NULL,
  `area_m2` decimal(6,2) DEFAULT NULL,
  `max_occupants` smallint unsigned DEFAULT NULL,
  `amenities` json DEFAULT NULL,
  `monthly_price` decimal(12,2) NOT NULL,
  `compensation_fee` decimal(12,2) DEFAULT NULL,
  `contract_end_date` date DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `status` enum('pending','active','urgent','completed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pass_posted_by` (`posted_by`),
  KEY `idx_pass_address` (`address_id`),
  KEY `idx_pass_status` (`status`),
  KEY `fk_pass_room` (`room_listing_id`),
  CONSTRAINT `fk_pass_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `fk_pass_room` FOREIGN KEY (`room_listing_id`) REFERENCES `room_listings` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pass_user` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_pass_listings`
--

LOCK TABLES `room_pass_listings` WRITE;
/*!40000 ALTER TABLE `room_pass_listings` DISABLE KEYS */;
INSERT INTO `room_pass_listings` VALUES (1,3,4,3,'Pass phòng trọ giá sinh viên, còn hợp đồng 6 tháng','Phòng đang thuê ổn, chuyển công tác nên cần pass lại.','pass','phong_tro',18.00,2,'[\"Full nội thất\"]',1500000.00,300000.00,'2026-12-31','Chuyển công tác vào TPHCM','cancelled','2026-09-27 16:36:10','2026-09-29 08:30:10',NULL),(2,NULL,6,2,'Pass gấp phòng trọ gần trường, giá tốt','Phòng đầy đủ nội thất cơ bản, chủ dễ tính, cần pass gấp do có việc đột xuất.','pass','phong_tro',20.00,2,'[\"Full nội thất\"]',1600000.00,200000.00,'2026-10-15','Về quê','urgent','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(3,NULL,5,1,'Sang nhượng hợp đồng chung cư mini Tân Xã','Còn thời hạn hợp đồng, chuyển đi vì lý do cá nhân.','transfer','chung_cu_mini',26.00,2,'[\"Có điều hòa\"]',2300000.00,NULL,'2026-11-01',NULL,'active','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL);
/*!40000 ALTER TABLE `room_pass_listings` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_room_pass_after_insert` AFTER INSERT ON `room_pass_listings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, new_data)
  VALUES ('room_pass_listings', NEW.id, 'INSERT', @app_user_id,
    JSON_OBJECT('title', NEW.title, 'monthly_price', NEW.monthly_price, 'status', NEW.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_room_pass_after_update` AFTER UPDATE ON `room_pass_listings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data, new_data)
  VALUES ('room_pass_listings', NEW.id, 'UPDATE', @app_user_id,
    JSON_OBJECT('title', OLD.title, 'monthly_price', OLD.monthly_price, 'status', OLD.status),
    JSON_OBJECT('title', NEW.title, 'monthly_price', NEW.monthly_price, 'status', NEW.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_room_pass_after_delete` AFTER DELETE ON `room_pass_listings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data)
  VALUES ('room_pass_listings', OLD.id, 'DELETE', @app_user_id,
    JSON_OBJECT('title', OLD.title, 'monthly_price', OLD.monthly_price, 'status', OLD.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `roommate_images`
--

DROP TABLE IF EXISTS `roommate_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roommate_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `roommate_listing_id` bigint unsigned NOT NULL,
  `media_url` varchar(255) NOT NULL,
  `media_type` enum('image','video') NOT NULL DEFAULT 'image',
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_roommate_images_listing` (`roommate_listing_id`),
  CONSTRAINT `fk_roommate_images_listing` FOREIGN KEY (`roommate_listing_id`) REFERENCES `roommate_listings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roommate_images`
--

LOCK TABLES `roommate_images` WRITE;
/*!40000 ALTER TABLE `roommate_images` DISABLE KEYS */;
INSERT INTO `roommate_images` VALUES (1,1,'https://picsum.photos/seed/roommate1a/800/600','image',1,'2026-09-27 16:36:10'),(2,2,'https://picsum.photos/seed/roommate2a/800/600','image',1,'2026-09-27 16:36:10'),(3,3,'https://picsum.photos/seed/roommate3a/800/600','image',1,'2026-09-27 16:36:10');
/*!40000 ALTER TABLE `roommate_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roommate_listings`
--

DROP TABLE IF EXISTS `roommate_listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roommate_listings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `posted_by` bigint unsigned NOT NULL,
  `address_id` bigint unsigned NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `place_info` text,
  `age` smallint unsigned DEFAULT NULL,
  `room_type` enum('has_room','looking_for_room') NOT NULL,
  `property_type` enum('phong_tro','chung_cu_mini','nha_nguyen_can') DEFAULT NULL,
  `area_m2` decimal(6,2) DEFAULT NULL,
  `budget_min` decimal(12,2) DEFAULT NULL,
  `budget_max` decimal(12,2) DEFAULT NULL,
  `move_in_date` date DEFAULT NULL,
  `gender_preference` enum('any','male','female') NOT NULL DEFAULT 'any',
  `amenities` json DEFAULT NULL,
  `publish_at` datetime DEFAULT NULL,
  `status` enum('active','closed') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_roommate_posted_by` (`posted_by`),
  KEY `idx_roommate_address` (`address_id`),
  KEY `idx_roommate_status` (`status`),
  CONSTRAINT `fk_roommate_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `fk_roommate_user` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roommate_listings`
--

LOCK TABLES `roommate_listings` WRITE;
/*!40000 ALTER TABLE `roommate_listings` DISABLE KEYS */;
INSERT INTO `roommate_listings` VALUES (1,4,3,'Có phòng trống, tìm nữ ở ghép Thạch Thất','Mình đang thuê phòng 2 người, còn 1 giường trống, tìm bạn nữ ở ghép, sạch sẽ, hoà đồng.','Phòng full nội thất, có điều hòa, giờ giấc tự do.',20,'has_room','phong_tro',18.00,1100000.00,1300000.00,'2026-10-01','female','[\"Full nội thất\", \"Có điều hòa\"]',NULL,'active','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(2,6,2,'Tìm phòng + người ở ghép khu Thạch Hòa','Mình mới chuyển ra Hòa Lạc đi làm, muốn tìm phòng và ở ghép cùng 1-2 bạn, ngân sách vừa phải.',NULL,21,'looking_for_room','phong_tro',NULL,1000000.00,1200000.00,'2026-10-15','any','[\"Giờ giấc tự do\"]',NULL,'active','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(3,5,1,'Ở ghép Tân Xã, cần bạn nam cùng chia phòng','Phòng 2 người, tiện đi làm, tìm bạn nam sạch sẽ, không hút thuốc trong phòng.','Phòng có gác lửng, an ninh tốt.',22,'has_room','chung_cu_mini',26.00,1200000.00,1400000.00,NULL,'male','[\"Có gác lửng\"]',NULL,'closed','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL);
/*!40000 ALTER TABLE `roommate_listings` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_roommate_after_insert` AFTER INSERT ON `roommate_listings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, new_data)
  VALUES ('roommate_listings', NEW.id, 'INSERT', @app_user_id,
    JSON_OBJECT('title', NEW.title, 'room_type', NEW.room_type, 'status', NEW.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_roommate_after_update` AFTER UPDATE ON `roommate_listings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data, new_data)
  VALUES ('roommate_listings', NEW.id, 'UPDATE', @app_user_id,
    JSON_OBJECT('title', OLD.title, 'room_type', OLD.room_type, 'status', OLD.status),
    JSON_OBJECT('title', NEW.title, 'room_type', NEW.room_type, 'status', NEW.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_roommate_after_delete` AFTER DELETE ON `roommate_listings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data)
  VALUES ('roommate_listings', OLD.id, 'DELETE', @app_user_id,
    JSON_OBJECT('title', OLD.title, 'room_type', OLD.room_type, 'status', OLD.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `user_oauth_accounts`
--

DROP TABLE IF EXISTS `user_oauth_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_oauth_accounts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `provider` enum('google') NOT NULL DEFAULT 'google',
  `provider_uid` varchar(255) NOT NULL,
  `provider_email` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_oauth_provider_uid` (`provider`,`provider_uid`),
  KEY `idx_oauth_user` (`user_id`),
  CONSTRAINT `fk_oauth_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_oauth_accounts`
--

LOCK TABLES `user_oauth_accounts` WRITE;
/*!40000 ALTER TABLE `user_oauth_accounts` DISABLE KEYS */;
INSERT INTO `user_oauth_accounts` VALUES (1,5,'google','google-oauth2|1084729384756','nam.hoang@gmail.com','2026-09-21 07:37:49'),(2,7,'google','101793788791874642074','ducbaonguyen508@gmail.com','2026-09-21 09:26:38'),(3,8,'google','101207008659978004549','nguyenducbao173@gmail.com','2026-09-21 15:32:12');
/*!40000 ALTER TABLE `user_oauth_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `role` enum('tenant','landlord','admin') NOT NULL DEFAULT 'tenant',
  `status` enum('active','locked') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  UNIQUE KEY `uq_users_phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nguyễn Văn Admin','admin@nhatro.vn','0900000001','$2a$12$YCFtT.zPUz.mqhmC3H0UEOWfIB58FHax6bvuUUWuum8h0dbR4oJKG',NULL,'admin','active','2026-09-21 07:37:49','2026-09-27 17:24:09',NULL),(2,'Trần Thị Lan','lan.tran@nhatro.vn','0900000002','$2a$12$mLMotpmceig7QpAddAcypOb6mKCjO9qUmO/f5Fqu5pmbkAwzJZSoG',NULL,'landlord','active','2026-09-21 07:37:49','2026-09-27 18:27:01',NULL),(3,'Phạm Văn Hùng','hung.pham@nhatro.vn','0900000003','$2a$12$mLMotpmceig7QpAddAcypOb6mKCjO9qUmO/f5Fqu5pmbkAwzJZSoG',NULL,'landlord','active','2026-09-21 07:37:49','2026-09-27 18:27:03',NULL),(4,'Lê Thị Mai','mai.le@gmail.com','0900000004','$2a$12$mLMotpmceig7QpAddAcypOb6mKCjO9qUmO/f5Fqu5pmbkAwzJZSoG','https://res.cloudinary.com/sb9z4tbj/image/upload/v1790665125/avatars/qsp0pbkxlbc199fgrhgs.png','tenant','active','2026-05-03 20:37:49','2026-10-09 20:26:46',NULL),(5,'Hoàng Văn Nam','nam.hoang@gmail.com','0900000005',NULL,NULL,'tenant','active','2026-09-21 07:37:49','2026-09-21 07:37:49',NULL),(6,'Đỗ Thị Hoa','hoa.do@gmail.com','0900000006','$2b$10$Nv9u0ypJ7rjM4pA3j2rERuPKAFQz6UlNHbJ.eYO0UNujSfpuyFtom',NULL,'tenant','locked','2026-09-21 07:37:49','2026-09-21 07:37:49',NULL),(7,'nguyen ducbao','ducbaonguyen508@gmail.com',NULL,NULL,'https://lh3.googleusercontent.com/a/ACg8ocJKAodrMSlFGxNG2r88pgJwRh-FX2NUk8frX-nIpExjvb1r6Qiy=s96-c','tenant','active','2026-09-21 09:26:38','2026-09-21 09:26:38',NULL),(8,'Đức Bảo Nguyễn','nguyenducbao173@gmail.com',NULL,NULL,'https://lh3.googleusercontent.com/a/ACg8ocKxEtg3RdmfL9ciXNxKGxl92-g4PbRfLIFTgCc0mkKwOShgWpHu=s96-c','tenant','active','2026-09-21 15:32:12','2026-09-21 15:32:12',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_users_after_insert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, new_data)
  VALUES ('users', NEW.id, 'INSERT', @app_user_id,
    JSON_OBJECT('full_name', NEW.full_name, 'email', NEW.email, 'role', NEW.role, 'status', NEW.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_users_after_update` AFTER UPDATE ON `users` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data, new_data)
  VALUES ('users', NEW.id, 'UPDATE', @app_user_id,
    JSON_OBJECT('full_name', OLD.full_name, 'email', OLD.email, 'role', OLD.role, 'status', OLD.status),
    JSON_OBJECT('full_name', NEW.full_name, 'email', NEW.email, 'role', NEW.role, 'status', NEW.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_users_after_delete` AFTER DELETE ON `users` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data)
  VALUES ('users', OLD.id, 'DELETE', @app_user_id,
    JSON_OBJECT('full_name', OLD.full_name, 'email', OLD.email, 'role', OLD.role, 'status', OLD.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `vehicle_bookings`
--

DROP TABLE IF EXISTS `vehicle_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_bookings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` bigint unsigned NOT NULL,
  `renter_id` bigint unsigned NOT NULL,
  `pickup_address_id` bigint unsigned NOT NULL,
  `dropoff_address_id` bigint unsigned NOT NULL,
  `scheduled_at` datetime NOT NULL,
  `estimated_hours` decimal(5,2) DEFAULT NULL,
  `total_price` decimal(12,2) DEFAULT NULL,
  `status` enum('pending','confirmed','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  `note` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_booking_vehicle` (`vehicle_id`),
  KEY `idx_booking_renter` (`renter_id`),
  KEY `idx_booking_status` (`status`),
  KEY `fk_booking_pickup` (`pickup_address_id`),
  KEY `fk_booking_dropoff` (`dropoff_address_id`),
  CONSTRAINT `fk_booking_dropoff` FOREIGN KEY (`dropoff_address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `fk_booking_pickup` FOREIGN KEY (`pickup_address_id`) REFERENCES `addresses` (`id`),
  CONSTRAINT `fk_booking_renter` FOREIGN KEY (`renter_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_booking_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_bookings`
--

LOCK TABLES `vehicle_bookings` WRITE;
/*!40000 ALTER TABLE `vehicle_bookings` DISABLE KEYS */;
INSERT INTO `vehicle_bookings` VALUES (1,1,4,1,2,'2026-09-25 08:00:00',3.00,600000.00,'confirmed','Cần 2 người khuân đồ, có tủ lạnh và giường.','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(2,3,6,2,3,'2026-09-22 14:00:00',1.50,120000.00,'completed','Chỉ chở valy và thùng đồ nhỏ.','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(3,2,5,3,1,'2026-09-30 09:00:00',NULL,NULL,'pending','Chưa rõ số lượng đồ, cần tài xế liên hệ trước.','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL);
/*!40000 ALTER TABLE `vehicle_bookings` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_vehicle_bookings_after_insert` AFTER INSERT ON `vehicle_bookings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, new_data)
  VALUES ('vehicle_bookings', NEW.id, 'INSERT', @app_user_id,
    JSON_OBJECT('vehicle_id', NEW.vehicle_id, 'renter_id', NEW.renter_id, 'status', NEW.status, 'total_price', NEW.total_price));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_vehicle_bookings_after_update` AFTER UPDATE ON `vehicle_bookings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data, new_data)
  VALUES ('vehicle_bookings', NEW.id, 'UPDATE', @app_user_id,
    JSON_OBJECT('status', OLD.status, 'total_price', OLD.total_price),
    JSON_OBJECT('status', NEW.status, 'total_price', NEW.total_price));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_vehicle_bookings_after_delete` AFTER DELETE ON `vehicle_bookings` FOR EACH ROW BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data)
  VALUES ('vehicle_bookings', OLD.id, 'DELETE', @app_user_id,
    JSON_OBJECT('vehicle_id', OLD.vehicle_id, 'renter_id', OLD.renter_id, 'status', OLD.status, 'total_price', OLD.total_price));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `vehicle_images`
--

DROP TABLE IF EXISTS `vehicle_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_id` bigint unsigned NOT NULL,
  `media_url` varchar(255) NOT NULL,
  `media_type` enum('image','video') NOT NULL DEFAULT 'image',
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_vehicle_images_vehicle` (`vehicle_id`),
  CONSTRAINT `fk_vehicle_images_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_images`
--

LOCK TABLES `vehicle_images` WRITE;
/*!40000 ALTER TABLE `vehicle_images` DISABLE KEYS */;
INSERT INTO `vehicle_images` VALUES (1,1,'https://picsum.photos/seed/vehicle1a/800/600','image',1,'2026-09-27 16:36:10'),(2,2,'https://picsum.photos/seed/vehicle2a/800/600','image',1,'2026-09-27 16:36:10'),(3,3,'https://picsum.photos/seed/vehicle3a/800/600','image',1,'2026-09-27 16:36:10');
/*!40000 ALTER TABLE `vehicle_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `owner_id` bigint unsigned NOT NULL,
  `vehicle_type` enum('motorbike','van','truck') NOT NULL,
  `service_type` varchar(50) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `license_plate` varchar(20) NOT NULL,
  `capacity_kg` decimal(8,2) DEFAULT NULL,
  `price_per_hour` decimal(12,2) DEFAULT NULL,
  `price_per_trip` decimal(12,2) DEFAULT NULL,
  `description` text,
  `tags` json DEFAULT NULL,
  `status` enum('available','busy','hidden') NOT NULL DEFAULT 'available',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_vehicle_plate` (`license_plate`),
  KEY `idx_vehicle_owner` (`owner_id`),
  KEY `idx_vehicle_status` (`status`),
  CONSTRAINT `fk_vehicle_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES (1,3,'van','Chuyển nhà trọn gói','Ford Transit chở đồ','51C-123.45',1000.00,200000.00,500000.00,'Xe van rộng, phù hợp chuyển nhà phòng trọ, có tài xế hỗ trợ khuân đồ.','[\"Trọn gói\", \"Có bảo hiểm\"]','available','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(2,3,'truck','Xe tải nhỏ','Xe tải 1.5 tấn','29C-678.90',1500.00,300000.00,800000.00,'Xe tải thùng kín, chở được đồ đạc cỡ lớn.','[\"Đường dài\", \"Có bốc xếp\"]','busy','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL),(3,2,'motorbike','Xe máy kéo','Xe máy chở hàng Honda Wave','59P1-111.22',100.00,80000.00,150000.00,'Phù hợp chở đồ nhỏ, thùng loa, valy sinh viên.','[\"Giá rẻ\", \"Nhanh chóng\"]','available','2026-09-27 16:36:10','2026-09-27 16:36:10',NULL);
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-10  3:31:04
