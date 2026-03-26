"use client";

import { Header } from "@/components/header";
import { EditorPanel } from "@/components/editor-panel";
import { PreviewPanel } from "@/components/preview-panel";
import { UpdateDialog } from "@/components/update-dialog";
import { LocaleProvider } from "@/components/locale-provider";
import { useDesktopAppEvents } from "@/hooks/use-desktop-app-events";
import { useAppStore } from "@/lib/store";
import { BrowserOpenURL } from "@/frontend/wailsjs/runtime/runtime";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  const importConfigFromCpp = useAppStore((s) => s.importConfigFromCpp);
  const { updateInfo, clearUpdateInfo } = useDesktopAppEvents(importConfigFromCpp);

  const handleUpdate = () => {
    if (!updateInfo?.url) return;
    BrowserOpenURL(updateInfo.url);
    clearUpdateInfo();
  };

  return (
    <LocaleProvider>
      <>
        <main className="flex h-screen w-screen flex-col overflow-hidden bg-zinc-50 font-inter antialiased text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
          <Header />
          <ResizablePanelGroup className="flex-1 overflow-hidden">
            <ResizablePanel defaultSize={52} minSize={30}>
              <EditorPanel />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={48} minSize={25}>
              <PreviewPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>

        <UpdateDialog
          updateInfo={updateInfo}
          onClose={clearUpdateInfo}
          onUpdate={handleUpdate}
        />
      </>
    </LocaleProvider>
  );
}
