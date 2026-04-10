#!/usr/bin/env node

import fs from "node:fs";

const packageJsonPath = new URL("../package.json", import.meta.url);
const wailsJsonPath = new URL("../wails.json", import.meta.url);

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const wails = JSON.parse(fs.readFileSync(wailsJsonPath, "utf8"));

const currentVersion = String(pkg.version || "").trim();
if (!currentVersion) {
  throw new Error("package.json version is empty");
}

wails.info ??= {};
wails.info.productVersion = currentVersion;

fs.writeFileSync(wailsJsonPath, `${JSON.stringify(wails, null, 2)}\n`, "utf8");
