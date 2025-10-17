#!/bin/bash

serverPort=""

# Create the files
serverConfig="[server]
[mysqld]
user            = mysql
port            = $serverPort
bind-address    = 0.0.0.0

datadir     = /var/lib/mysql
socket      = /run/mysqld/mysqld.sock
pid-file    = /run/mysqld/mysqld.pid

log_error = /var/log/mysql/error.log

character-set-server = utf8mb4
collation-server     = utf8mb4_general_ci

skip-name-resolve
symbolic-links = 0

default_storage_engine = InnoDB"

serverService="[Unit]
Description=MariaDB Server Instance
After=network.target

[Service]
ExecStart=/usr/sbin/mariadbd --defaults-file=/etc/mysql/mariadb.conf.d/50-server.conf --user=mysql
User=mysql
Group=mysql
Restart=always
RuntimeDirectory=mysqld

[Install]
WantedBy=multi-user.target"

# Save the files
echo "$serverConfig" | sudo tee "/etc/mysql/mariadb.conf.d/50-server.conf" > /dev/null
echo "$serverService" | sudo tee "/usr/lib/systemd/system/mariadb.service" > /dev/null

# Initialize the datadir
sudo mariadb-install-db --defaults-file="/etc/mysql/mariadb.conf.d/50-server.conf" --user=mysql --datadir="/var/lib/mysql"

# Reload the daemon
echo "Restarting the daemons..."
sudo systemctl daemon-reload

# Start and enable the servers
echo "Starting MariaDB..."
sudo systemctl enable mariadb
sudo systemctl start mariadb
echo -e "MariaDB started!\n"

# Edit PMA's config
sudo sed -i "s/\$cfg\['Servers'\]\[\$i\]\['port'\] = .*/\$cfg['Servers'][$i]['port'] = '15001';/" /etc/phpmyadmin/config.inc.php

# Activate PMA's service
sudo systemctl reload php8.3-fpm