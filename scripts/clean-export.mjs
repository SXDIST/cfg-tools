#!/usr/bin/env node

import { rm } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import path from "node:path";

async function removeMaps(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await removeMaps(entryPath);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".map")) {
      await rm(entryPath, { force: true });
    }
  }
}

await removeMaps("out");
