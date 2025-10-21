#!/bin/bash

echo -e "Updating system packages...\n"

# Updates the system
sudo apt update -y
sudo apt upgrade -y

echo -e "Installing dependencies...\n"

# Security installs
# TODO: Instalar herramientas como finger

# Installs the needed packages to run the backend
sudo apt install -y git npm nginx mariadb-server phpmyadmin php8.3-fpm php-mysql

# Installs navigation packages
# TODO: Instalar fastfetch y oh my bash

echo -e "Installation complete \n\n"