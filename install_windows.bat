@echo off

set /p "tizen_directory=Enter Tizen path (default: \tizen-studio): "
if "%tizen_directory%"=="" set "tizen_directory=\tizen-studio"

set /p "app_directory=Enter .wgt app path (default: Crunchyroll.wgt): "
if "%app_directory%"=="" set "app_directory=Crunchyroll.wgt"

set /p "device_ip=Enter device IP (example: 192.168.0.37): "

if "%device_ip%"=="" (
  echo Error: The device IP is required.
  exit /b 1
)

cd %tizen_directory%/tools
sdb connect %device_ip%
for /f "tokens=3" %%a in ('sdb devices ^| findstr /c:"device"') do set "device_name=%%a"
cd %tizen_directory%/tools/ide/bin
tizen install -t %device_name% --name %app_directory%

pause
