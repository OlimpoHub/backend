#!/bin/bash

echo -e "\n"
read -p "What port will sql have? " sqlPort
echo -e "\n"
read -p "What port will php my admin have? " pmaPort

# Create the files
serverConfig="[client]
port = $sqlPort
socket = /run/mysqld/mysqld.sock

[mysqld]
user            = mysql
pid-file        = /run/mysqld/mysqld.pid
socket          = /run/mysqld/mysqld.sock
datadir         = /var/lib/mysql
port            = $sqlPort
bind-address    = 0.0.0.0

log_error       = /var/log/mysql/error.log
symbolic-links  = 0
skip-name-resolve
default_storage_engine = InnoDB
character-set-server = utf8mb4
collation-server = utf8mb4_general_ci

# Include all other configs
!includedir /etc/mysql/mariadb.conf.d/"

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
sudo systemctl restart mariadb
echo -e "MariaDB started!\n"

# Edit PMA's config
sudo sed -i "s/\$cfg\\['Servers'\\]\\[\$i\\]\\['port'\\] = .*/\$cfg['Servers'][\$i]['port'] = '$sqlPort';/" /etc/phpmyadmin/config.inc.php

# Activate PMA's service
sudo systemctl enable php8.3-fpm
sudo systemctl start php8.3-fpm