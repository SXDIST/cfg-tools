"use client";

import { useAppStore } from "@/lib/store";
import { Copy, Download, Trash, Plus, CopyPlus, FolderOpen } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generateCpp } from "@/lib/generator";

export function Sidebar() {
    const configs = useAppStore(s => s.configs);
    const activeConfigId = useAppStore(s => s.activeConfigId);
    const addConfig = useAppStore(s => s.addConfig);
    const deleteConfig = useAppStore(s => s.deleteConfig);
    const duplicateConfig = useAppStore(s => s.duplicateConfig);
    const renameConfig = useAppStore(s => s.renameConfig);
    const setActiveConfig = useAppStore(s => s.setActiveConfig);

    const handleExportAll = async () => {
        if (configs.length === 0) return;
        const zip = new JSZip();
        configs.forEach(config => {
            const cppStr = generateCpp(config);
            const safeName = config.name.replace(/[^a-zA-Z0-9]/g, '_') || 'config';
            zip.file(`${safeName}_config.cpp`, cppStr);
        });
        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, "configs.zip");
    };

    return (
        <TooltipProvider>
            <div className="w-16 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-full shrink-0">
                <div className="p-3 border-b flex items-center justify-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => addConfig()}>
                                <Plus className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Новый проект</TooltipContent>
                    </Tooltip>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2 flex flex-col gap-1">
                        {configs.map(config => (
                            <Tooltip key={config.id}>
                                <TooltipTrigger asChild>
                                    <div
                                        className={`flex items-center justify-center p-2 rounded-md cursor-pointer transition-colors ${
                                            activeConfigId === config.id 
                                                ? 'bg-zinc-100 dark:bg-zinc-800/70' 
                                                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/30'
                                        }`}
                                        onClick={() => setActiveConfig(config.id)}
                                    >
                                        <FolderOpen className={`w-5 h-5 ${activeConfigId === config.id ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500'}`} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="max-w-[200px]">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium">{config.name}</span>
                                        <div className="flex gap-1 mt-1">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6" 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    duplicateConfig(config.id); 
                                                }}
                                            >
                                                <CopyPlus className="w-3 h-3" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6" 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    deleteConfig(config.id); 
                                                }}
                                            >
                                                <Trash className="w-3 h-3 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                        {configs.length === 0 && (
                            <div className="text-center mt-4">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <FolderOpen className="w-5 h-5 mx-auto text-zinc-300" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Нет проектов</TooltipContent>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-3 border-t flex items-center justify-center">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={handleExportAll}>
                                <Download className="w-5 h-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Экспорт всех ZIP</TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </TooltipProvider>
    );
}
