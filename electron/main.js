const { app, BrowserWindow, globalShortcut, Menu } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

const isDev = !app.isPackaged;

// ✅ Ensure the backend is correctly referenced
const backendPath = isDev
  ? path.join(__dirname, "../backend/server.js") // Development mode
  : path.join(process.resourcesPath, "backend", "server.js"); // Production mode

let backendProcess;
let mainWindow;

// ✅ Function to start the backend server
function startBackend() {
  backendProcess = spawn("node", [backendPath], {
    cwd: isDev ? path.join(__dirname, "../backend") : process.resourcesPath,
    stdio: "inherit",
    shell: true,
    detached: true, // ✅ Keeps the process running independently
  });

  backendProcess.on("exit", (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

// ✅ Stop backend when the app closes
app.on("before-quit", () => {
  console.log("Quitting application...");
  if (backendProcess) backendProcess.kill();
  app.exit();
});

app.whenReady().then(() => {
  startBackend(); // ✅ Start backend server

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // ✅ Load the Angular app
  const appURL = `file://${path.join(
    __dirname,
    "../dist/my-ang/browser/index.html"
  )}`;

  mainWindow.loadURL(appURL);

  // ✅ Handle refresh issues in production
  mainWindow.webContents.on("did-fail-load", () => {
    mainWindow.loadURL(appURL);
  });

  // ✅ Enable DevTools in development mode only
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // ✅ Reload shortcuts
  globalShortcut.register("F5", () => mainWindow.reload());
  globalShortcut.register("CommandOrControl+R", () => mainWindow.reload());

  // ✅ Prevent full refresh issues but allow file:// navigations
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file://") && !isDev) {
      event.preventDefault();
    }
  });

  // ✅ Custom menu for Angular routes
  const menuTemplate = [
    {
      label: "Navigation",
      submenu: [
        {
          label: "Home",
          click: () => mainWindow.webContents.send("navigate", "/home"),
        },
        {
          label: "Products",
          click: () => mainWindow.webContents.send("navigate", "/products"),
        },
        {
          label: "Users",
          click: () => mainWindow.webContents.send("navigate", "/users"),
        },
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
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
