"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
    Download, 
    Copy, 
    Plus, 
    Trash, 
    CopyPlus, 
    Settings,
    Save,
    FolderOpen
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generateCpp } from "@/lib/generator";

export function Header() {
    const configs = useAppStore(s => s.configs);
    const activeConfigId = useAppStore(s => s.activeConfigId);
    const activeConfig = configs.find(c => c.id === activeConfigId);
    
    const addConfig = useAppStore(s => s.addConfig);
    const duplicateConfig = useAppStore(s => s.duplicateConfig);
    const deleteConfig = useAppStore(s => s.deleteConfig);
    const renameConfig = useAppStore(s => s.renameConfig);
    const updateRequiredAddons = useAppStore(s => s.updateRequiredAddons);

    const [addonsDialogOpen, setAddonsDialogOpen] = useState(false);
    const [addonsInput, setAddonsInput] = useState("");

    const handleExportCurrent = async () => {
        if (!activeConfig) return;
        const cppStr = generateCpp(activeConfig);
        const blob = new Blob([cppStr], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `${activeConfig.name.replace(/[^a-zA-Z0-9]/g, '_')}_config.cpp`);
    };

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

    const handleOpenAddonsDialog = () => {
        if (activeConfig) {
            setAddonsInput(activeConfig.requiredAddons.join(", "));
            setAddonsDialogOpen(true);
        }
    };

    const handleSaveAddons = () => {
        if (!activeConfig) return;
        const addons = addonsInput
            .split(",")
            .map(a => a.trim())
            .filter(a => a.length > 0);
        updateRequiredAddons(activeConfig.id, addons);
        setAddonsDialogOpen(false);
    };

    if (!activeConfig) {
        return (
            <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-semibold">cfg-tools</h1>
                    <span className="text-sm text-zinc-500">Инструмент для редактирования конфигов DayZ</span>
                </div>
                <Button onClick={() => addConfig()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Новый проект
                </Button>
            </div>
        );
    }

    return (
        <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-semibold">cfg-tools</h1>
                    <Input
                        value={activeConfig.name}
                        onChange={(e) => renameConfig(activeConfig.id, e.target.value)}
                        className="h-8 w-64 text-sm"
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <FolderOpen className="w-4 h-4 mr-2" />
                                Проект
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => addConfig()}>
                                <Plus className="w-4 h-4 mr-2" />
                                Новый проект
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => duplicateConfig(activeConfig.id)}>
                                <CopyPlus className="w-4 h-4 mr-2" />
                                Дублировать
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                onClick={() => deleteConfig(activeConfig.id)}
                                className="text-red-500 focus:text-red-600"
                            >
                                <Trash className="w-4 h-4 mr-2" />
                                Удалить
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Экспорт
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={handleExportCurrent}>
                                <Copy className="w-4 h-4 mr-2" />
                                Текущий конфиг
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleExportAll}>
                                <Download className="w-4 h-4 mr-2" />
                                Все конфиги (ZIP)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" size="sm" onClick={handleOpenAddonsDialog}>
                        <Settings className="w-4 h-4 mr-2" />
                        Аддоны
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Dialog для редактирования аддонов
function AddonsDialogContent({ 
    isOpen, 
    onClose, 
    onSave,
    value,
    onChange 
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    value: string;
    onChange: (value: string) => void;
}) {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Required Addons</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Список аддонов (через запятую)</Label>
                        <Input
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="DZ_Data, DZ_Characters"
                        />
                        <p className="text-xs text-zinc-500">
                            Введите названия аддонов, разделенные запятой
                        </p>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Отмена
                    </Button>
                    <Button onClick={onSave}>
                        Сохранить
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
