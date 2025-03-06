CREATE USER 'rosmu'@'localhost' IDENTIFIED BY 'hauta';
GRANT ALL PRIVILEGES ON `MyHealth`.* TO 'rosmu'@'localhost';
FLUSH PRIVILEGES;
