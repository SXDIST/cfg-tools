"use client";

import { useAppStore } from "@/lib/store";
import Editor from "@monaco-editor/react";
import { generateCpp } from "@/lib/generator";
import { Button } from "./ui/button";
import { Copy, Download } from "lucide-react";
import { saveAs } from "file-saver";
import { useMemo, useState, useEffect, useRef } from "react";

export function PreviewPanel() {
    const configs = useAppStore(s => s.configs);
    const activeConfigId = useAppStore(s => s.activeConfigId);

    const activeConfig = configs.find(c => c.id === activeConfigId);

    // Debounce the code generation to avoid re-rendering Monaco on every keystroke
    const [debouncedConfig, setDebouncedConfig] = useState(activeConfig);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setDebouncedConfig(activeConfig);
        }, 300);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [activeConfig]);

    const code = useMemo(() => {
        if (!debouncedConfig) return '';
        return generateCpp(debouncedConfig);
    }, [debouncedConfig]);

    if (!activeConfig) {
        return <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 bg-[#1e1e1e] font-jetbrains-mono">
            <span className="text-xl font-medium tracking-tight opacity-50">cfg-tools</span>
            <span className="text-sm mt-2 opacity-50">No configuration selected</span>
        </div>;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `${activeConfig.name.replace(/[^a-zA-Z0-9]/g, '_')}_config.cpp`);
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900 text-zinc-300 font-jetbrains-mono">
                <h3 className="text-sm font-medium">config.cpp</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white transition-colors">
                        <Copy className="w-3 h-3 mr-2" /> Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload} className="h-8 bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white transition-colors">
                        <Download className="w-3 h-3 mr-2" /> Download
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-hidden pt-2">
                <Editor
                    height="100%"
                    defaultLanguage="cpp"
                    theme="vs-dark"
                    value={code}
                    options={{
                        readOnly: true,
                        domReadOnly: true,
                        readOnlyMessage: { value: "Конфиг генерируется автоматически, редактирование недоступно." },
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', 'Fira Code', Consolas, monospace",
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        tabSize: 2,
                        insertSpaces: true,
                        padding: { top: 16 }
                    }}
                />
            </div>
        </div>
    );
}
