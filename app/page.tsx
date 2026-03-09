import { Header } from "@/components/header";
import { EditorPanel } from "@/components/editor-panel";
import { PreviewPanel } from "@/components/preview-panel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
  return (
    <main className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-inter antialiased text-zinc-900 dark:text-zinc-50">
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
  );
}
