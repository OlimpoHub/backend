#!/bin/bash

read -p "Write the usernames of the user's that will have their password reset: " userNames

read -s -p "What default password will they have? " defaultPwd

# For each user in the input
for userName in $userNames; do
    # Set password as default
    echo "$userName:$defaultPwd" | sudo chpasswd

    # Expire password at login
    sudo passwd -e "$userName"
done

echo -e "The users now have a default password, and when they log in, they will reset it.\n"