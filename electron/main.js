const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // ✅ Load the index.html file directly
    mainWindow.loadFile(path.join(__dirname, '../dist/my-ang/browser/index.html'));

    // ✅ Handle refresh issues
    mainWindow.webContents.on('did-fail-load', () => {
        mainWindow.loadFile(path.join(__dirname, '../dist/my-ang/browser/index.html'));
    });

    // ✅ Reload shortcuts
    globalShortcut.register('F5', () => {
        mainWindow.reload();
    });

    globalShortcut.register('CommandOrControl+R', () => {
        mainWindow.reload();
    });

    // ✅ Prevent full refresh issues, but allow file:// navigations
    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (!url.startsWith('file://')) {
            event.preventDefault();
        }
    });

    // ✅ Enable DevTools for debugging
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
