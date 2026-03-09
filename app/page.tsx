import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { EditorPanel } from "@/components/editor-panel";
import { PreviewPanel } from "@/components/preview-panel";
import { AppContextMenu } from "@/components/app-context-menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  return (
    <main className="flex h-screen w-screen overflow-hidden bg-white dark:bg-zinc-950 font-inter antialiased text-zinc-900 dark:text-zinc-50">
      <AppContextMenu>
        <Sidebar />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <Header />
          {/* @ts-expect-error Types mismatch from shadcn resizable */}
          <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
            <ResizablePanel defaultSize={55} minSize={30}>
              <EditorPanel />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={45} minSize={30}>
              <PreviewPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </AppContextMenu>
    </main>
  );
}
