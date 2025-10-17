#!/bin/bash

echo "Updating system packages..."

# Updates the system
sudo apt update -y
sudo apt upgrade -y

echo "Installing dependencies..."

# Installs the needed packages to run the backend
sudo apt install -y git npm nginx mariadb-server phpmyadmin php-fpm php-mysql



echo -e "Installation complete \n\n"