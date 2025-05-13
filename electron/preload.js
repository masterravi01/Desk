const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  navigate: (callback) =>
    ipcRenderer.on("navigate", (_, route) => callback(route)),

  // ✅ FIXED Auto-update listeners
  onUpdateAvailable: (callback) =>
    ipcRenderer.on("update_available", () => callback()),

  onUpdateDownloaded: (callback) =>
    ipcRenderer.on("update_downloaded", () => callback()),
});
