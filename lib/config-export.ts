import JSZip from "jszip";

import type { ConfigData } from "@/lib/store";
import { generateCpp } from "@/lib/generator";

export function getSafeConfigFileStem(name: string) {
  return name.replace(/[^a-zA-Z0-9]/g, "_") || "config";
}

export function buildConfigCppBlob(config: ConfigData) {
  return new Blob([generateCpp(config)], {
    type: "text/plain;charset=utf-8",
  });
}

export async function buildConfigsZip(configs: ConfigData[]) {
  const zip = new JSZip();

  configs.forEach((config) => {
    zip.file(
      `${getSafeConfigFileStem(config.name)}_config.cpp`,
      generateCpp(config),
    );
  });

  return zip.generateAsync({ type: "blob" });
}
