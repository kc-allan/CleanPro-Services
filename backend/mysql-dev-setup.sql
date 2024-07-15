-- Creates database hbnb_dev_db
CREATE DATABASE IF NOT EXISTS cleanpro_db;
USE cleanpro_db;
CREATE USER IF NOT EXISTS 'cleanpro_dev'@'localhost';
SET PASSWORD FOR 'cleanpro_dev'@'localhost' = 'password';
GRANT ALL PRIVILEGES ON cleanpro_db.* TO 'cleanpro_dev'@'localhost';
GRANT SELECT ON performance_schema.* TO 'cleanpro_dev'@'localhost';
