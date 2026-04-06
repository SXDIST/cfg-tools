/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const { spawn } = require("node:child_process");
const fsSync = require("node:fs");
const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");

const APP_VERSION = app.getVersion();
const GITHUB_OWNER = "SXDIST";
const GITHUB_REPO = "cfg-tools";
const UPDATE_EVENT_NAME = "app:update-available";
const LOCALE_PREFERENCES_FILE = "preferences.json";
const isDev = !app.isPackaged;

function getPreferencesPath() {
  return path.join(app.getPath("userData"), LOCALE_PREFERENCES_FILE);
}

function readPreferences() {
  try {
    const raw = fsSync.readFileSync(getPreferencesPath(), "utf8");
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function readStoredLocale() {
  const locale = readPreferences().locale;
  return locale === "ru" ? "ru" : "en";
}

async function writeStoredLocale(locale) {
  const nextLocale = locale === "ru" ? "ru" : "en";
  const preferences = {
    ...readPreferences(),
    locale: nextLocale,
  };

  await fs.mkdir(path.dirname(getPreferencesPath()), { recursive: true });
  await fs.writeFile(
    getPreferencesPath(),
    JSON.stringify(preferences, null, 2),
    "utf8",
  );
}

function getRendererEntry() {
  if (isDev) {
    return process.env.DEV_SERVER_URL || "http://localhost:3000";
  }

  return path.join(__dirname, "..", "out", "index.html");
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    title: "cfg-tools",
    width: 1280,
    height: 720,
    backgroundColor: "#ffffff",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const entry = getRendererEntry();
  if (isDev) {
    void mainWindow.loadURL(entry);
    return mainWindow;
  }

  void mainWindow.loadFile(entry);
  return mainWindow;
}

function normalizeVersion(version) {
  return String(version || "").trim().replace(/^v/i, "");
}

function parseVersionParts(version) {
  const normalized = normalizeVersion(version);
  if (!normalized) {
    return [];
  }

  return normalized.split(".").map((part) => {
    let numeric = "";
    for (const char of part) {
      if (char < "0" || char > "9") {
        break;
      }
      numeric += char;
    }

    return Number.parseInt(numeric || "0", 10);
  });
}

function isVersionNewer(candidate, current) {
  const candidateParts = parseVersionParts(candidate);
  const currentParts = parseVersionParts(current);
  const maxLength = Math.max(candidateParts.length, currentParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const candidatePart = candidateParts[index] || 0;
    const currentPart = currentParts[index] || 0;

    if (candidatePart > currentPart) {
      return true;
    }

    if (candidatePart < currentPart) {
      return false;
    }
  }

  return false;
}

function firstNonEmpty(...values) {
  return values.find((value) => String(value || "").trim() !== "") || "";
}

function releaseAssetTargets() {
  switch (process.platform) {
    case "win32":
      return ["windows-amd64", "windows_x64", "win64", "x64", ".exe", ".msi", ".zip"];
    case "darwin":
      return ["darwin-arm64", "darwin-amd64", "macos", ".dmg", ".pkg", ".zip"];
    default:
      return ["linux-amd64", "linux-arm64", ".appimage", ".deb", ".rpm", ".tar.gz", ".zip"];
  }
}

function isPortableRuntime() {
  return Boolean(process.env.PORTABLE_EXECUTABLE_DIR);
}

function pickWindowsInstallerUrl(release) {
  if (!release) {
    return "";
  }

  for (const asset of release.assets || []) {
    const assetName = String(asset?.name || "").toLowerCase();
    if (
      asset.browser_download_url &&
      assetName.endsWith(".exe") &&
      !assetName.includes("portable") &&
      (assetName.includes("setup") || assetName.includes("nsis"))
    ) {
      return asset.browser_download_url;
    }
  }

  return "";
}

function pickReleaseUrl(release) {
  if (!release) {
    return "";
  }

  for (const target of releaseAssetTargets()) {
    for (const asset of release.assets || []) {
      const assetName = String(asset?.name || "").toLowerCase();
      if (assetName.includes(target) && asset.browser_download_url) {
        return asset.browser_download_url;
      }
    }
  }

  if (release.html_url) {
    return release.html_url;
  }

  for (const asset of release.assets || []) {
    if (asset.browser_download_url) {
      return asset.browser_download_url;
    }
  }

  return "";
}

async function fetchLatestRelease() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": `${GITHUB_REPO}/${APP_VERSION}`,
        },
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub returned status ${response.status}`);
    }

    const release = await response.json();
    if (release?.draft || release?.prerelease) {
      return null;
    }

    return release;
  } finally {
    clearTimeout(timeout);
  }
}

async function checkForUpdates(mainWindow) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  try {
    const release = await fetchLatestRelease();
    if (!release) {
      return;
    }

    const latestVersion = normalizeVersion(release.tag_name);
    if (!latestVersion || !isVersionNewer(latestVersion, APP_VERSION)) {
      return;
    }

    const payload = {
      currentVersion: APP_VERSION,
      latestVersion,
      title: firstNonEmpty(release.name, release.tag_name, "New release"),
      notes: String(release.body || "").trim(),
      url: pickReleaseUrl(release),
      installerUrl: pickWindowsInstallerUrl(release),
    };

    mainWindow.webContents.send("desktop:event", {
      name: UPDATE_EVENT_NAME,
      payload,
    });
  } catch {
    // Ignore update failures to match prior desktop behavior.
  }
}

async function downloadFile(url, targetPath) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/octet-stream,application/vnd.github+json",
      "User-Agent": `${GITHUB_REPO}/${APP_VERSION}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Download failed with status ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(targetPath, Buffer.from(arrayBuffer));
}

async function installOrOpenUpdate(updateInfo) {
  const safeUpdateInfo =
    updateInfo && typeof updateInfo === "object" ? updateInfo : {};
  const releaseUrl =
    typeof safeUpdateInfo.url === "string" ? safeUpdateInfo.url.trim() : "";
  const installerUrl =
    typeof safeUpdateInfo.installerUrl === "string"
      ? safeUpdateInfo.installerUrl.trim()
      : "";
  const latestVersion =
    typeof safeUpdateInfo.latestVersion === "string"
      ? normalizeVersion(safeUpdateInfo.latestVersion)
      : "";

  if (process.platform !== "win32" || isPortableRuntime()) {
    if (releaseUrl) {
      await shell.openExternal(releaseUrl);
    }
    return;
  }

  if (!installerUrl) {
    if (releaseUrl) {
      await shell.openExternal(releaseUrl);
    }
    return;
  }

  const fallbackName = latestVersion
    ? `cfg-tools-setup-${latestVersion}.exe`
    : "cfg-tools-setup.exe";
  const fileName = path.basename(new URL(installerUrl).pathname) || fallbackName;
  const targetPath = path.join(os.tmpdir(), fileName);

  await downloadFile(installerUrl, targetPath);

  const installerProcess = spawn(targetPath, [], {
    detached: true,
    stdio: "ignore",
  });

  installerProcess.unref();
  app.quit();
}

app.whenReady().then(() => {
  const mainWindow = createWindow();

  ipcMain.handle("app:read-text-file", async (_event, filePath) => {
    return fs.readFile(String(filePath), "utf8");
  });

  ipcMain.handle("app:check-for-updates", async () => {
    await checkForUpdates(mainWindow);
  });

  ipcMain.on("app:get-locale", (event) => {
    event.returnValue = readStoredLocale();
  });

  ipcMain.handle("app:set-locale", async (_event, locale) => {
    await writeStoredLocale(locale);
    return readStoredLocale();
  });

  ipcMain.handle("shell:open-external", async (_event, url) => {
    if (typeof url !== "string" || url.trim() === "") {
      return;
    }

    await shell.openExternal(url);
  });

  ipcMain.handle("app:install-or-open-update", async (_event, updateInfo) => {
    await installOrOpenUpdate(updateInfo);
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
