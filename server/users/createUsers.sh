#!/bin/bash

echo -e "Create the users and the groups...\n"

# Change root password
read -s -p "What password will the root user have? " rootPwd
inputs="$inputs\n$rootPwd"
echo "root:$rootPwd" | sudo chpasswd

# Create admin account
read -p "What name will the admin have? " adminName
inputs="$inputs\n$adminName"
mkdir -p "/home/$adminName"
sudo useradd "$adminName" -d "/home/$adminName" -c "System Administrator"

read -s -p "What password will the admin have in the server and sql? " adminPwd
inputs="$inputs\n$adminPwd"
echo "$adminName:$adminPwd" | sudo chpasswd

# Add the user to sudoers
sudo usermod -aG sudo "$adminName"

# Create Linux Groups
read -p "\nHow many groups will there be? " groupAmount
inputs="$inputs\n$groupAmount"

groupNames=""

for ((i = 1; i <= groupAmount; i++)); do
    # Enter the group name
    read -p "What name will the group have? " groupName
    inputs="$inputs\n$groupName"

    # Create the group
    sudo groupadd "$groupName"

    # Create the group folder
    mkdir -p "/home/teams/$groupName"

    # Change the owner of the file
    chown "$adminName":"$groupName" "/home/teams/$groupName"
    chmod 2770 "/home/teams/$groupName"
done

# Get default password for users
read -s -p "What default password will the users have? " defaultPwd
inputs="$inputs\n$defaultPwd"

# Create the users
read -p "\nHow many users will there be? " userAmount
inputs="$inputs\n$userAmount"

for ((i = 1; i <= userAmount; i++)); do
    read -p "\nWhat name will the user have? " userName
    inputs="$inputs\n$userName"

    read -p "\nWhat is the full name of the user? " userFullName
    inputs="$inputs\n$userFullName"

    read -p "\nWhat group will the user be part of? " userGroup
    inputs="$inputs\n$userGroup"

    # Create the user
    sudo useradd "$userName" -d "/home/$userGroup" -c "$userFullName"

    # Add user to their group
    sudo usermod -g "$userGroup" "$userName"

    # Set password as default
    echo "$userName:$defaultPwd" | sudo chpasswd

    # Expire password at login
    sudo passwd -e "$userName"
done

# Create PMA / MySQL Users -> Antes de hacerlo, preguntar contraseña para admin

# Create sql admin account
sudo mariadb -u root -p -e "CREATE USER '$adminName'@'%' IDENTIFIED BY '$adminPwd'; GRANT ALL PRIVILEGES ON *.* TO '$adminName'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"