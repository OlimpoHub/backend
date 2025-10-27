#!/bin/bash

echo -e "Updating system packages...\n"

# Updates the system
sudo apt update -y
sudo apt upgrade -y

echo -e "Installing dependencies...\n"

# Utility installs
sudo apt install -y nano tree

# Security installs
sudo apt install -y finger openssh-server

# Installs the needed packages to run the backend
sudo apt install -y git npm nginx mariadb-server phpmyadmin php8.3-fpm php-mysql

echo -e "Installation complete \n\n"