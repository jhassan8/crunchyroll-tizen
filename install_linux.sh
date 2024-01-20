#!/bin/bash

echo "Welcome!"
echo "Before proceeding with the installation of the Tizen application,"
echo "make sure you have configured your device as a developer and have Tizen Studio installed."
echo ""

read -p "Enter Tizen full path (default: /tizen-studio): " tizen_directory
tizen_directory=${tizen_directory:-$HOME/tizen-studio}

read -p "Enter .wgt app full path (default: crunchyroll_online.wgt): " app_directory
app_directory=$(pwd)/${app_directory:-crunchyroll_online.wgt}

read -p "Enter device IP (example: 192.168.0.37): " device_ip

if [ -z "$device_ip" ]; then
  echo "Error: The device IP is required."
  exit 1
fi

cd "$tizen_directory/tools"
./sdb connect "$device_ip"
device_name=$(./sdb devices | awk '/device/ && NR>1 {print $3}')
cd "$tizen_directory/tools/ide/bin"
./tizen install -t $device_name -n $app_directory

read -p "Press [Enter] to exit."
