const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  Menu,
} = require("electron");
const path = require("path");
const isDev = !app.isPackaged;
const { setupIpcHandlers } = require("./ipcHandlers");

// Auto-Updater
const { autoUpdater } = require("electron-updater");
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;
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
    : `file://${path.resolve(
        app.getAppPath(),
        "dist/alfa/browser/index.html"
      )}`; // FIXED PATH

  mainWindow.loadURL(startURL);

  // Retry loading on failure
  mainWindow.webContents.on("did-fail-load", () => {
    setTimeout(() => mainWindow.loadURL(startURL), 1000);
  });

  // Developer Shortcuts
  globalShortcut.register("CommandOrControl+R", () => mainWindow.reload());
  globalShortcut.register("F5", () => mainWindow.reload());
  globalShortcut.register("CommandOrControl+Shift+I", () => {
    if (mainWindow) mainWindow.webContents.toggleDevTools();
  });

  // Block external links in prod
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file://") && !isDev) {
      event.preventDefault();
    }
  });

  // Set up custom menu
  const menuTemplate = [
    {
      label: "Master",
      submenu: [
        {
          label: "Business Master",
          click: () =>
            mainWindow.webContents.send("navigate", "/businessMaster"),
        },
        {
          label: "System Parameter",
          click: () =>
            mainWindow.webContents.send("navigate", "/systemParameter"),
        },
        { type: "separator" },
        { label: "Exit", role: "quit" },
      ],
    },
    {
      label: "Transactions",
      submenu: [
        {
          label: "Order Confirmation",
          click: () => mainWindow.webContents.send("navigate", "/orderConfirm"),
        },
        {
          label: "Confirm Invoice",
          click: () =>
            mainWindow.webContents.send("navigate", "/confirmInvoice"),
        },
      ],
    },
    {
      label: "Report",
      submenu: [
        {
          label: "Order Confirmation",
          click: () =>
            mainWindow.webContents.send("navigate", "/orderConfirmReport"),
        },
        {
          label: "Final Invoice",
          click: () =>
            mainWindow.webContents.send("navigate", "/finalInvoiceReport"),
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  if (!isDev) {
    autoUpdater.on("update-available", () => {
      mainWindow.webContents.send("update_available");
    });
    autoUpdater.on("update-downloaded", () => {
      mainWindow.webContents.send("update_downloaded");
    });
    autoUpdater.on("error", (error) => {
      console.error("❌ Auto-updater error:", error);
    });
    autoUpdater.on("download-progress", (progressObj) => {
      console.log(`Download speed: ${progressObj.bytesPerSecond}`);
      console.log(`Downloaded: ${progressObj.percent}%`);
    });

    ipcMain.handle("install_update", async () => {
      autoUpdater.quitAndInstall();
    });

    autoUpdater.checkForUpdatesAndNotify();
  }
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
