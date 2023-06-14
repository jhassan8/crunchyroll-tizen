#!/bin/sh

read -p "Enter tizen path (default: ~/tizen-studio): " tizen_directory
tizen_directory=${tizen_directory:-$HOME/tizen-studio}
read -p "Enter .wgt app path (default: Crunchyroll.wgt): " app_directory
app_directory=${app_directory:-Crunchyroll.wgt}
read -p "Enter device ip (example: 192.168.0.37): " device_ip

if [ -z $device_ip ]; then
  echo "Error: the device ip is required."
  exit 1
fi

cd "$tizen_directory/tools"
./sdb connect "$device_ip"
device_name=$(./sdb devices | awk '/device/{print $3}')
cd "$tizen_directory/tools/ide/bin"
./tizen install -t "$device_name" --name "$app_directory"

read -p "Press Enter to exit"
