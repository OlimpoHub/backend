#!/bin/bash

# Create Linux Users

# Create PMA / MySQL Users -> Antes de hacerlo, preguntar contraseña para admin

# Create sql admin account
sudo mariadb -u root -p -e "CREATE USER 'theadmin'@'%' IDENTIFIED BY '1234'; GRANT ALL PRIVILEGES ON *.* TO 'theadmin'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"