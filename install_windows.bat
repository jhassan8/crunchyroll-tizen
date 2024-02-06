@echo off

echo Welcome!
echo Before proceeding with the installation of the Tizen application,
echo make sure you have configured your device as a developer and have Tizen Studio installed.
echo.

set /p "tizen_directory=Enter Tizen full path (default: \tizen-studio): "
if "%tizen_directory%"=="" set "tizen_directory=\tizen-studio"

set /p "app_directory=Enter .wgt app full path (default: crunchyroll_online.wgt): "
if "%app_directory%"=="" set "app_directory=%~dp0crunchyroll_online.wgt"

set /p "device_ip=Enter device IP (example: 192.168.0.37): "

if "%device_ip%"=="" (
  echo Error: The device IP is required.
  exit /b 1
)

cd "%tizen_directory%/tools"
sdb connect %device_ip%
for /f "tokens=3" %%a in ('sdb devices ^| findstr /c:"device"') do set "device_name=%%a"
cd ide/bin
tizen install -t "%device_name%" -n "%app_directory%"

pause
