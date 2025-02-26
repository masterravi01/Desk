const { app, BrowserWindow, ipcMain, globalShortcut, Menu } = require("electron");
const path = require("path");
const isDev = !app.isPackaged;
const { setupIpcHandlers } = require("./ipcHandlers");


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(app.getAppPath(), "electron", "preload.js"), // FIXED PATH
    },
  });

  const startURL = isDev
    ? "http://localhost:4200"
    : `file://${path.resolve(app.getAppPath(), "dist/alfa/browser/index.html")}`; // FIXED PATH

  mainWindow.loadURL(startURL);

  // Handle load failure (retry)
  mainWindow.webContents.on("did-fail-load", () => {
    mainWindow.loadURL(startURL);
  });

  // Open DevTools only in dev mode
  mainWindow.webContents.openDevTools();

  // Reload shortcuts
  globalShortcut.register("F5", () => mainWindow.reload());
  globalShortcut.register("CommandOrControl+R", () => mainWindow.reload());

  // Prevent external navigation in production
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file://") && !isDev) {
      event.preventDefault();
    }
  });

  // Custom application menu
  const menuTemplate = [
    {
      label: "Navigation",
      submenu: [
        { label: "Home", click: () => mainWindow.webContents.send("navigate", "/home") },
        { label: "Products", click: () => mainWindow.webContents.send("navigate", "/products") },
        { label: "Users", click: () => mainWindow.webContents.send("navigate", "/users") },
        { type: "separator" },
        { label: "Exit", role: "quit" },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  setupIpcHandlers();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
