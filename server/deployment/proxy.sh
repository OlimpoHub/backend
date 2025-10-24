#!/bin/bash

# Disable default  

# Enable Php My Admin
pmaProxy="server {
    listen $pmaPort;

    location / {
        alias /usr/share/phpmyadmin/;
        index index.php;
        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_param SCRIPT_FILENAME \$request_filename;
            fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        }
    }
}"
echo "$pmaProxy" | sudo tee "/etc/nginx/sites-available/phpmyadmin" > /dev/null
sudo ln -s /etc/nginx/sites-available/phpmyadmin /etc/nginx/sites-enabled/

sudo systemctl enable nginx
sudo systemctl restart nginx