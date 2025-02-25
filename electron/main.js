const { app, BrowserWindow, globalShortcut, Menu } = require("electron");
const path = require("path");

const isDev = !app.isPackaged;
const backendPath = isDev
  ? path.join(__dirname, "../backend/server.js") // Development mode
  : path.join(process.resourcesPath, "backend/server.js"); // Production mode

require(backendPath);

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // ✅ Load the index.html file directly
  mainWindow.loadFile(
    path.join(__dirname, "../dist/my-ang/browser/index.html")
  );

  // ✅ Handle refresh issues
  mainWindow.webContents.on("did-fail-load", () => {
    mainWindow.loadFile(
      path.join(__dirname, "../dist/my-ang/browser/index.html")
    );
  });

  // ✅ Reload shortcuts
  globalShortcut.register("F5", () => {
    mainWindow.reload();
  });

  globalShortcut.register("CommandOrControl+R", () => {
    mainWindow.reload();
  });

  // ✅ Prevent full refresh issues, but allow file:// navigations
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file://")) {
      event.preventDefault();
    }
  });

  // ✅ Enable DevTools for debugging
  mainWindow.webContents.openDevTools();

  // Custom Menu with Angular Routes
  const menuTemplate = [
    {
      label: "Navigation",
      submenu: [
        {
          label: "Home",
          click: () => {
            mainWindow.webContents.send("navigate", "/home");
          },
        },
        {
          label: "Products",
          click: () => {
            mainWindow.webContents.send("navigate", "/products");
          },
        },
        {
          label: "Users",
          click: () => {
            mainWindow.webContents.send("navigate", "/users");
          },
        },
        { type: "separator" },
        {
          label: "Exit",
          role: "quit",
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});
app.on("before-quit", () => {
  console.log("Quitting application...");
  app.exit(); // Ensures process exits properly
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
