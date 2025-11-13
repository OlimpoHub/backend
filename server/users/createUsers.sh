#!/bin/bash

bashConfig="# --- COLORS ---
if [ -x /usr/bin/dircolors ]; then
    eval \"$(dircolors -b)\"
fi

# --- AUTOCOMPLETION ---
if [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
elif [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
fi

# --- HISTORY SETTINGS ---
HISTSIZE=500
HISTFILESIZE=1000
HISTCONTROL=ignoredups:erasedups
shopt -s histappend

# --- PROMPTS ---
GROUP=\$(id -gn)
PS1='╭─ \[\e[38;5;39m\]\${GROUP}'\"'\"'s vassal: \[\e[0;2m\]\u\[\e[0m\] in the \[\e[90;1m\]/\\^\[\e[38;5;208m\] OLYMPUS \[\e[90m\]^/\\ \[\e[0m\]× \[\e[38;5;198;3m\]\W\n\[\e[0m\]╰─ \[\e[38;5;35m\]\$ \[\e[0m\]'

# --- REDIRECT ---
cd /home/\$GROUP
"

profileConfig="# --- LOAD BASHRC ---
if [ -f /etc/bash.bashrc ]; then
    . /etc/bash.bashrc
fi
"

echo -e "Create the users and the groups...\n"

# Create the base bash file
echo "$bashConfig" | sudo tee "/etc/bash.bashrc" > /dev/null

# Change root password
read -s -p "What password will the root user have? " rootPwd
echo "root:$rootPwd" | sudo chpasswd

# Create admin account
echo -e "\n"
read -p "What name will the admin have? " adminName
sudo mkdir -p "/home/$adminName"
sudo chmod 2770 "/home/$adminName"
sudo useradd "$adminName" -d "/home/$adminName" -c "System Administrator"

read -s -p "What password will the admin have in the server and sql? " adminPwd
echo "$adminName:$adminPwd" | sudo chpasswd

# Add the user to sudoers
sudo usermod -aG sudo "$adminName"

# Config its bash
sudo chsh -s /bin/bash "$adminName"
sudo cp /etc/skel/.profile /home/"$adminName"/
echo "$profileConfig" | sudo tee "/home/$adminName/.profile" > /dev/null
echo "" | sudo tee "/home/$adminName/.bashrc" > /dev/null
sudo chown "$adminName": /home/"$adminName" /home/"$adminName"/.profile

# Create SQL admin account
sudo mariadb -u root -e "CREATE USER '$adminName'@'%' IDENTIFIED BY '$adminPwd'; GRANT ALL PRIVILEGES ON *.* TO '$adminName'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"

# Create the prod DB
sudo mariadb -u root -e "CREATE DATABASE Production;";

# Create Linux Groups
echo -e "\n"
read -p "How many groups will there be? " groupAmount

groupNames=""

for ((i = 1; i <= groupAmount; i++)); do
    # Enter the group name
    read -p "What name will the group have? " groupName

    # Create the group
    sudo groupadd "$groupName"

    # Create the group folder
    sudo mkdir -p "/home/$groupName"

    # Change the owner of the file
    sudo chown "$adminName":"$groupName" "/home/$groupName"
    sudo chmod 2770 "/home/$groupName"

    # Create the database
    sudo mariadb -u root -e "CREATE DATABASE $groupName;";
done

# Get default password for users
echo -e "\n"
read -s -p "What default password will the users have? " defaultPwd

# Create the users
echo -e "\nPlease paste the users, and then press Ctrl+D";

# Read all lines into an array
mapfile -t lines

# Loop over every 3 lines
for ((i=0; i<${#lines[@]}; i+=3)); do
    userName="${lines[i]}"
    userFullName="${lines[i+1]}"
    userGroup="${lines[i+2]}"

    # Create the user
    sudo useradd "$userName" -m -d "/home/$userGroup/.$userName" -c "$userFullName"

    # Add user to their group
    sudo usermod -g "$userGroup" "$userName"

    # Set password as default
    echo "$userName:$defaultPwd" | sudo chpasswd

    # Expire password at login
    sudo passwd -e "$userName"

    # Create SQL Account
    sudo mariadb -u root -e "CREATE USER '$userName'@'%' IDENTIFIED BY '$defaultPwd'; GRANT ALL PRIVILEGES ON $userGroup.* TO '$userName'@'%'; GRANT ALL PRIVILEGES ON Production.* TO '$userName'@'%'; FLUSH PRIVILEGES;"

    # Set bash as shell
    sudo chsh -s /bin/bash "$userName"
    sudo cp /etc/skel/.profile "/home/$userGroup/.$userName/."
    sudo touch "/home/$userGroup/.$userName/.bash_history"
    echo "$profileConfig" | sudo tee "/home/$userGroup/.$userName/.profile" > /dev/null
    sudo chown "$userName":"$userGroup" "/home/$userGroup/.$userName/" "/home/$userGroup/.$userName/.profile"
    sudo chmod 100 "/home/$userGroup/.$userName"
done

echo -e "\nThe users have been created. But when logging to PhpMyAdmin, the password must be set manually.\n"