const { app, components, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
      contextIsolation: true,
    },
  });
  // disable alt for menu bar
  win.setMenu(null);

  const userAgent =
    "Mozilla/5.0 (SMART-TV; LINUX; Tizen 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Version/5.0 TV Safari/537.36";

  win.webContents.setUserAgent(userAgent);

  win.loadFile("./static/build/index.html", {
    userAgent:
      "Mozilla/5.0 (SMART-TV; LINUX; Tizen 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Version/5.0 TV Safari/537.36",
  });
}

app.whenReady().then(async () => {
  await components.whenReady();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
