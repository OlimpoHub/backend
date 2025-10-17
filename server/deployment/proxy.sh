#!/bin/bash

# Enable Php My Admin

phpVersion="" #php8.3

pmaProxy="server {
    listen 80;

    location /pma/ {
        alias /usr/share/phpmyadmin/;
        index index.php;
        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_param SCRIPT_FILENAME $request_filename;
            fastcgi_pass unix:/run/php/$phpVersion-fpm.sock;
        }
    }

    location /pma {
        return 301 /pma/;
    }
}"
echo "$pmaProxy" | sudo tee "/etc/nginx/sites-available/phpmyadmin" > /dev/null
sudo ln -s /etc/nginx/sites-available/phpmyadmin /etc/nginx/sites-enabled/

sudo systemctl enable nginx
sudo systemctl restart nginx