const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    navigate: (callback) => ipcRenderer.on('navigate', (_, route) => callback(route)),
});
