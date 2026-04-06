/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("runtime", {
  desktop: "electron",
});

contextBridge.exposeInMainWorld("go", {
  main: {
    App: {
      ReadTextFile(path) {
        return ipcRenderer.invoke("app:read-text-file", path);
      },
      CheckForUpdates() {
        return ipcRenderer.invoke("app:check-for-updates");
      },
    },
  },
});

contextBridge.exposeInMainWorld("electronAPI", {
  getStoredLocale() {
    return ipcRenderer.sendSync("app:get-locale");
  },
  setStoredLocale(locale) {
    return ipcRenderer.invoke("app:set-locale", locale);
  },
  installOrOpenUpdate(updateInfo) {
    return ipcRenderer.invoke("app:install-or-open-update", updateInfo);
  },
  openExternal(url) {
    return ipcRenderer.invoke("shell:open-external", url);
  },
  onRuntimeEvent(listener) {
    const wrapped = (_event, payload) => {
      listener(payload);
    };

    ipcRenderer.on("desktop:event", wrapped);
    return () => {
      ipcRenderer.removeListener("desktop:event", wrapped);
    };
  },
});
