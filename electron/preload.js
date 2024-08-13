const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronUtilsRender", {
  exitApp: () => ipcRenderer.send("exitApp"),
});
