# Crunchyroll for TIZEN

## Description:

**INFO: Application is incomplete, some features are missing that will be added later.**

## TODO Features:

#### Complete
- [x] Auth workflow
- [x] Home screen
- [x] Details screen
- [x] Episodes screen
- [x] Video player
- [x] Menu options screen
- [x] Search element
- [x] Auto next episode

#### In progress
- [ ] History screen and workflow
- [ ] Change audio and subtitles language inside player
- [ ] Browse elements by categories

#### Pending
- [ ] My list screen and workflow
- [ ] Settings screen

## Captures:
![layouts.gif](https://raw.githubusercontent.com/jhassan8/crunchyroll-tizen/master/layouts.gif)

## Installation

1. Install [Tizen Studio](https://developer.tizen.org/development/tizen-studio/download)
2. In Package Manager install "Extension SDK" -> "TV extension <version>"
3. Clone repository ```git clone https://github.com/jhassan8/crunchyroll-tizen```
4. Open project ("File" -> "Open Project From File System" -> "Directory") and select project folder
5. in tv open [developer mode](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html)
    - Open Samsung Apps
    - Press buttons 1, 2, 3, 4, 5
    - Enable developer Mode
    - Enter IP address PC with tizen studio
6. Open "Device manager" -> ("Remote Device" -> "Scan") and Select Your Device
7. Right click on the project ("Run as" -> "Tizen Web Application". (if the option does not appear, follow the next steps)
    - Right click on the project
    - Configure
    - Convert To Tizen Project
8. The app opens on the TV and will be installed.

## Instalation CLI (recommended)

#### required: npm, configure device (developer mode, "on" device in "device manager")
#### veresions: online (auto-update use cdn), offline (no auto-update)

1. Set tizen var
    - Linux: ```export PATH=$PATH:<your_tizen_path>/tizen-studio/tools/ide/bin```
    - Windows: ```set PATH=%PATH%;<your_tizen_path>/tizen-studio/tools/ide/bin```
2. Install build dependencies: ```npm install```
3. In project folder run:
    - online: ```npm run start-tv-online --tv=<name_of_tv_device_manager>```
    - offline: ```npm run start-tv --tv=<name_of_tv_device_manager>```
