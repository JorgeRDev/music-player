import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

import "./handlers.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    darkTheme: false,
    frame: true,
    titleBarOverlay: {
      color: "#f9f9f9",
      height: 32,
    },
    titleBarStyle: "hidden",
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      devTools: true,
      preload: path.join(__dirname, "./preload.mjs"),
    },
  });

  win.setBackgroundMaterial("mica");
  // Test active push message to Renderer-process.

  win.on("enter-full-screen", () => {
    console.log(`App is on fullscreen`);

    const channel = "is-app-full-screen";
    const isFullScreen = true;

    console.log(
      `Sending the message isFullscreen: ${isFullScreen} through the channel ${channel}`
    );

    const eventHasListeners = win?.webContents.send(channel, isFullScreen);

    if (eventHasListeners) {
      console.log(`The ${channel} event has listeners`);
    } else {
      console.log(`The ${channel} event has no listeners`);
    }
  });

  win.on("leave-full-screen", () => {
    console.log(`App is not on fullscreen`);

    const channel = "is-app-full-screen";
    const isFullScreen = false;

    console.log(
      `Sending the message isFullscreen: ${isFullScreen} through the channel ${channel}`
    );

    const eventHasListeners = win?.webContents.send(channel, isFullScreen);

    if (eventHasListeners) {
      console.log(`The ${channel} event has listeners`);
    } else {
      console.log(`The ${channel} event has no listeners`);
    }
  });

  win.on("ready-to-show", () => {
    win?.webContents.setZoomFactor(1);
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on;

app.whenReady().then(createWindow);
