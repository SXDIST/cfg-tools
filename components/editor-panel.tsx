"use client";

import { useState, memo, useCallback } from "react";
import { useAppStore, ChildClassData, SlotData, ProxyData } from "@/lib/store";
import { AnimEventOption } from "@/lib/catalog";
import { CATALOG } from "@/lib/catalog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { HelpCircle, ChevronDown, Plus, Trash, X, Copy, PlusCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";

// ============================================================
// MEMOIZED SUB-COMPONENTS
// ============================================================

// --- SLOTS SECTION ---
const SlotsSection = memo(function SlotsSection({ slots, configId, tabId }: {
    slots: SlotData[];
    configId: string;
    tabId: string;
}) {
    const addSlot = useAppStore(s => s.addSlot);
    const updateSlot = useAppStore(s => s.updateSlot);
    const deleteSlot = useAppStore(s => s.deleteSlot);

    return (
        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 px-1">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold">Слоты (CfgSlots)</h3>
                    <p className="text-xs text-zinc-500 mt-1">Определение слотов для прикрепления предметов.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => addSlot(configId, tabId)}>
                    <Plus className="w-4 h-4 mr-2" /> Добавить
                </Button>
            </div>
            <div className="flex flex-col gap-4 mb-10">
                {slots.length === 0 && (
                    <div className="text-center text-xs text-zinc-500 py-6 border border-dashed rounded-md dark:border-zinc-800">
                        Нет слотов. Нажмите «Добавить».
                    </div>
                )}
                {slots.map(slot => (
                    <div key={slot.id} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col gap-3">
                        <div className="flex gap-3 items-end">
                            <div className="flex-1">
                                <Label className="text-xs text-zinc-500 ml-1">Имя слота</Label>
                                <div className="flex items-center gap-0 mt-1">
                                    <span className="h-8 px-2 flex items-center text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border border-r-0 border-zinc-200 dark:border-zinc-700 rounded-l-md text-zinc-500 select-none">Slot_</span>
                                    <Input
                                        value={slot.slotName}
                                        onChange={(e) => updateSlot(configId, tabId, slot.id, { slotName: e.target.value })}
                                        className="h-8 text-sm bg-white dark:bg-zinc-950 font-mono rounded-l-none"
                                        placeholder="weaponHandguardAK"
                                    />
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500 shrink-0" onClick={() => deleteSlot(configId, tabId, slot.id)}>
                                <Trash className="w-4 h-4" />
                            </Button>
                        </div>
                        <div>
                            <Label className="text-xs text-zinc-500 ml-1">displayName</Label>
                            <Input
                                value={slot.displayName}
                                onChange={(e) => updateSlot(configId, tabId, slot.id, { displayName: e.target.value })}
                                className="h-8 mt-1 text-sm bg-white dark:bg-zinc-950 font-mono"
                                placeholder="#STR_CfgHandguard0"
                            />
                        </div>
                        <div>
                            <Label className="text-xs text-zinc-500 ml-1">ghostIcon</Label>
                            <div className="flex items-center gap-0 mt-1">
                                <span className="h-8 px-2 flex items-center text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border border-r-0 border-zinc-200 dark:border-zinc-700 rounded-l-md text-zinc-500 select-none shrink-0">set:</span>
                                <Input
                                    value={slot.ghostIconSet}
                                    onChange={(e) => updateSlot(configId, tabId, slot.id, { ghostIconSet: e.target.value })}
                                    className="h-8 text-sm bg-white dark:bg-zinc-950 font-mono rounded-none border-r-0"
                                    placeholder="dayz_inventory"
                                />
                                <span className="h-8 px-2 flex items-center text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border border-r-0 border-zinc-200 dark:border-zinc-700 text-zinc-500 select-none shrink-0">image:</span>
                                <Input
                                    value={slot.ghostIconImage}
                                    onChange={(e) => updateSlot(configId, tabId, slot.id, { ghostIconImage: e.target.value })}
                                    className="h-8 text-sm bg-white dark:bg-zinc-950 font-mono rounded-l-none"
                                    placeholder="handguard"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

// --- PROXIES SECTION ---
const ProxiesSection = memo(function ProxiesSection({ proxies, configId, tabId }: {
    proxies: ProxyData[];
    configId: string;
    tabId: string;
}) {
    const addProxy = useAppStore(s => s.addProxy);
    const updateProxy = useAppStore(s => s.updateProxy);
    const deleteProxy = useAppStore(s => s.deleteProxy);

    return (
        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 px-1">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold">Прокси объекты (CfgNonAIVehicles)</h3>
                    <p className="text-xs text-zinc-500 mt-1">Объявление прикрепляемых частей (ProxyAttachment).</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => addProxy(configId, tabId)}>
                    <Plus className="w-4 h-4 mr-2" /> Добавить
                </Button>
            </div>
            <div className="flex flex-col gap-4 mb-10">
                {proxies.length === 0 && (
                    <div className="text-center text-xs text-zinc-500 py-6 border border-dashed rounded-md dark:border-zinc-800">
                        Нет прокси. Нажмите «Добавить».
                    </div>
                )}
                {proxies.map(proxy => (
                    <div key={proxy.id} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col gap-3">
                        <div className="flex gap-3 items-end">
                            <div className="flex-1">
                                <Label className="text-xs text-zinc-500 ml-1">Имя прокси</Label>
                                <div className="flex items-center gap-0 mt-1">
                                    <span className="h-8 px-2 flex items-center text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border border-r-0 border-zinc-200 dark:border-zinc-700 rounded-l-md text-zinc-500 select-none">Proxy</span>
                                    <Input
                                        value={proxy.proxyName}
                                        onChange={(e) => updateProxy(configId, tabId, proxy.id, { proxyName: e.target.value })}
                                        className="h-8 text-sm bg-white dark:bg-zinc-950 font-mono rounded-l-none"
                                        placeholder="belt_back_proxy"
                                    />
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500 shrink-0" onClick={() => deleteProxy(configId, tabId, proxy.id)}>
                                <Trash className="w-4 h-4" />
                            </Button>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label className="text-xs text-zinc-500 ml-1">inventorySlot</Label>
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => {
                                    updateProxy(configId, tabId, proxy.id, { inventorySlots: [...proxy.inventorySlots, ''] });
                                }}>
                                    <Plus className="w-3 h-3 mr-1" /> Добавить
                                </Button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {proxy.inventorySlots.map((slot, idx) => (
                                    <div key={idx} className="flex items-center gap-1">
                                        <Input
                                            value={slot}
                                            onChange={(e) => {
                                                const updated = [...proxy.inventorySlots];
                                                updated[idx] = e.target.value;
                                                updateProxy(configId, tabId, proxy.id, { inventorySlots: updated });
                                            }}
                                            className="h-8 text-xs bg-white dark:bg-zinc-950 font-mono"
                                            placeholder="Material_L1"
                                        />
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500 shrink-0" onClick={() => {
                                            const updated = proxy.inventorySlots.filter((_, i) => i !== idx);
                                            updateProxy(configId, tabId, proxy.id, { inventorySlots: updated });
                                        }}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                {proxy.inventorySlots.length === 0 && (
                                    <div className="text-[10px] text-zinc-500 italic pl-1">Нет слотов</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

// --- RETEXTURES SECTION ---
const RetexturesSection = memo(function RetexturesSection({ children, configId, tabId, className }: {
    children: ChildClassData[];
    configId: string;
    tabId: string;
    className: string;
}) {
    const addChildClass = useAppStore(s => s.addChildClass);
    const updateChildClass = useAppStore(s => s.updateChildClass);
    const deleteChildClass = useAppStore(s => s.deleteChildClass);

    const handleChildArrayChange = (childId: string, field: 'hiddenSelectionsTextures' | 'hiddenSelectionsMaterials', index: number, value: string) => {
        const child = children?.find(c => c.id === childId);
        if (!child) return;
        const newArray = [...(child[field] || [])];
        newArray[index] = value;
        updateChildClass(configId, tabId, childId, { [field]: newArray });
    };

    const handleAddChildArrayItem = (childId: string, field: 'hiddenSelectionsTextures' | 'hiddenSelectionsMaterials') => {
        const child = children?.find(c => c.id === childId);
        if (!child) return;
        updateChildClass(configId, tabId, childId, { [field]: [...(child[field] || []), ''] });
    };

    const handleRemoveChildArrayItem = (childId: string, field: 'hiddenSelectionsTextures' | 'hiddenSelectionsMaterials', index: number) => {
        const child = children?.find(c => c.id === childId);
        if (!child) return;
        const newArray = [...(child[field] || [])];
        newArray.splice(index, 1);
        updateChildClass(configId, tabId, childId, { [field]: newArray });
    };

    return (
        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 px-1">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold">Варианты / Ретекстуры</h3>
                    <p className="text-xs text-zinc-500 mt-1">Дочерние классы, наследующие основные параметры этого класса.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => addChildClass(configId, tabId, `${className} _Variant`)}>
                    <Plus className="w-4 h-4 mr-2" /> Добавить
                </Button>
            </div>
            <div className="flex flex-col gap-4 mb-10">
                {(!children || children.length === 0) && (
                    <div className="text-center text-xs text-zinc-500 py-6 border border-dashed rounded-md dark:border-zinc-800">
                        Нет ретекстур. Нажмите «Добавить».
                    </div>
                )}
                {children?.map(child => (
                    <div key={child.id} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col gap-3 relative group">
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteChildClass(configId, tabId, child.id)}>
                            <Trash className="w-4 h-4 text-zinc-400 hover:text-red-500" />
                        </Button>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <Label className="text-xs text-zinc-500 ml-1">Имя класса</Label>
                                <Input
                                    value={child.name}
                                    onChange={(e) => updateChildClass(configId, tabId, child.id, { name: e.target.value })}
                                    className="h-8 mt-1 text-sm bg-white dark:bg-zinc-950 font-semibold"
                                />
                            </div>
                            <div className="w-24">
                                <Label className="text-xs text-zinc-500 ml-1">Scope</Label>
                                <Input
                                    type="number"
                                    value={child.scope}
                                    min={0}
                                    max={2}
                                    onChange={(e) => {
                                        const val = Math.max(0, Math.min(2, Number(e.target.value)));
                                        updateChildClass(configId, tabId, child.id, { scope: val });
                                    }}
                                    className="h-8 mt-1 text-sm bg-white dark:bg-zinc-950 font-mono"
                                />
                            </div>
                            <div className="w-28">
                                <Label className="text-[10px] uppercase text-zinc-500 ml-1">Visibility Mod.</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={child.visibilityModifier ?? 1.0}
                                    onChange={(e) => {
                                        updateChildClass(configId, tabId, child.id, { visibilityModifier: Number(e.target.value) });
                                    }}
                                    className="h-8 mt-1 text-sm bg-white dark:bg-zinc-950 font-mono"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-xs text-zinc-500 ml-1">Текстуры (hiddenSelectionsTextures)</Label>
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleAddChildArrayItem(child.id, 'hiddenSelectionsTextures')}>
                                        <Plus className="w-3 h-3 mr-1" /> Добавить
                                    </Button>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {(child.hiddenSelectionsTextures || []).map((tex, idx) => (
                                        <div key={idx} className="flex items-center gap-1">
                                            <Input
                                                value={tex}
                                                onChange={(e) => handleChildArrayChange(child.id, 'hiddenSelectionsTextures', idx, e.target.value)}
                                                className="h-8 text-xs bg-white dark:bg-zinc-950 font-mono"
                                                placeholder="path\to\texture.paa"
                                            />
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500 shrink-0" onClick={() => handleRemoveChildArrayItem(child.id, 'hiddenSelectionsTextures', idx)}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {(!child.hiddenSelectionsTextures || child.hiddenSelectionsTextures.length === 0) && (
                                        <div className="text-[10px] text-zinc-500 italic pl-1">Нет текстур</div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-xs text-zinc-500 ml-1">Материалы (hiddenSelectionsMaterials)</Label>
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => handleAddChildArrayItem(child.id, 'hiddenSelectionsMaterials')}>
                                        <Plus className="w-3 h-3 mr-1" /> Добавить
                                    </Button>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {(child.hiddenSelectionsMaterials || []).map((mat, idx) => (
                                        <div key={idx} className="flex items-center gap-1">
                                            <Input
                                                value={mat}
                                                onChange={(e) => handleChildArrayChange(child.id, 'hiddenSelectionsMaterials', idx, e.target.value)}
                                                className="h-8 text-xs bg-white dark:bg-zinc-950 font-mono"
                                                placeholder="path\to\material.rvmat"
                                            />
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500 shrink-0" onClick={() => handleRemoveChildArrayItem(child.id, 'hiddenSelectionsMaterials', idx)}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {(!child.hiddenSelectionsMaterials || child.hiddenSelectionsMaterials.length === 0) && (
                                        <div className="text-[10px] text-zinc-500 italic pl-1">Нет материалов</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

// --- ANIM EVENTS SECTION ---
const AnimEventsSection = memo(function AnimEventsSection({ enabledParams, values, configId, tabId }: {
    enabledParams: Record<string, boolean>;
    values: Record<string, any>;
    configId: string;
    tabId: string;
}) {
    const updateActiveTab = useAppStore(s => s.updateActiveTab);

    const animCategory = CATALOG.find(c => c.id === 'animEvents');
    if (!animCategory) return null;

    const allParams = animCategory.params;
    const isEnabled = allParams.some(p => enabledParams[p.key]);

    const handleToggleAll = (enabled: boolean) => {
        const updates: Record<string, boolean> = {};
        allParams.forEach(p => { updates[p.key] = enabled; });
        updateActiveTab({
            enabledParams: { ...enabledParams, ...updates }
        });
    };

    const handleValueChange = (key: string, value: any) => {
        updateActiveTab({
            values: { ...values, [key]: value }
        });
    };

    return (
        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 px-1">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">Звуковые события (AnimEvents)</h3>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">Базовый класс</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">Звуки взаимодействия с предметом (SoundWeapon).</p>
                </div>
                {!isEnabled ? (
                    <Button variant="outline" size="sm" onClick={() => handleToggleAll(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Добавить
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-red-500" onClick={() => handleToggleAll(false)}>
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <div className="mb-10">
                {!isEnabled ? (
                    <div className="text-center text-xs text-zinc-500 py-6 border border-dashed rounded-md dark:border-zinc-800">
                        Нет добавленных звуков. Нажмите «Добавить».
                    </div>
                ) : (
                    <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col gap-4">
                        {allParams.map(param => {
                            const val = values[param.key] ?? param.defaultValue;
                            return (
                                <div key={param.key}>
                                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">{param.label}</Label>
                                    <Select
                                        value={val?.soundSet || param.defaultValue?.soundSet || ""}
                                        onValueChange={(newSoundSet) => {
                                            const opt = param.options?.find(o => o.soundSet === newSoundSet);
                                            if (opt) {
                                                handleValueChange(param.key, { soundSet: opt.soundSet, id: opt.id });
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                            <SelectValue placeholder="Выберите звук..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {param.options?.map((opt) => (
                                                <SelectItem key={opt.soundSet} value={opt.soundSet}>
                                                    {opt.label} ({opt.soundSet})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {param.example && (
                                        <div className="mt-1">
                                            <span className="text-[10px] text-zinc-500 ml-1 block leading-tight">
                                                <span className="font-semibold text-zinc-400">Example:</span> {param.example}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
});

// --- CLOTHING TYPES SECTION ---
const ClothingTypesSection = memo(function ClothingTypesSection({ enabledParams, values, configId, tabId }: {
    enabledParams: Record<string, boolean>;
    values: Record<string, any>;
    configId: string;
    tabId: string;
}) {
    const updateActiveTab = useAppStore(s => s.updateActiveTab);

    const clothCategory = CATALOG.find(c => c.id === 'clothingTypes');
    if (!clothCategory) return null;

    const allParams = clothCategory.params;
    const isEnabled = allParams.some(p => enabledParams[p.key]);

    const handleToggleAll = (enabled: boolean) => {
        const updates: Record<string, boolean> = {};
        allParams.forEach(p => { updates[p.key] = enabled; });
        updateActiveTab({
            enabledParams: { ...enabledParams, ...updates }
        });
    };

    const handleValueChange = (key: string, value: any) => {
        updateActiveTab({
            values: { ...values, [key]: value }
        });
    };

    return (
        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 px-1">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">Типы одежды (ClothingTypes)</h3>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">Базовый класс</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">Пути к моделям мужских и женских персонажей.</p>
                </div>
                {!isEnabled ? (
                    <Button variant="outline" size="sm" onClick={() => handleToggleAll(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Добавить
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-red-500" onClick={() => handleToggleAll(false)}>
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <div className="mb-10">
                {!isEnabled ? (
                    <div className="text-center text-xs text-zinc-500 py-6 border border-dashed rounded-md dark:border-zinc-800">
                        Нет настроек. Нажмите «Добавить».
                    </div>
                ) : (
                    <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col gap-4">
                        {allParams.map(param => {
                            const value = values[param.key] ?? param.defaultValue;
                            return (
                                <div key={param.key}>
                                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">{param.label}</Label>
                                    <Input
                                        value={value}
                                        onChange={(e) => handleValueChange(param.key, e.target.value)}
                                        placeholder={param.description}
                                        className="h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-mono"
                                    />
                                    {param.example && (
                                        <div className="mt-1">
                                            <span className="text-[10px] text-zinc-500 ml-1 block leading-tight">
                                                <span className="font-semibold text-zinc-400">Example:</span> {param.example}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
});

// --- DAMAGE SYSTEM SECTION ---
const DamageSystemSection = memo(function DamageSystemSection({ enabledParams, values, configId, tabId }: {
    enabledParams: Record<string, boolean>;
    values: Record<string, any>;
    configId: string;
    tabId: string;
}) {
    const updateActiveTab = useAppStore(s => s.updateActiveTab);

    const dmgCategory = CATALOG.find(c => c.id === 'damageSystem');
    if (!dmgCategory) return null;

    const allParams = dmgCategory.params;
    const isEnabled = allParams.some(p => enabledParams[p.key]);

    const handleToggleAll = (enabled: boolean) => {
        const updates: Record<string, boolean> = {};
        allParams.forEach(p => { updates[p.key] = enabled; });
        updateActiveTab({
            enabledParams: { ...enabledParams, ...updates }
        });
    };

    const handleToggleParam = (key: string, enabled: boolean) => {
        updateActiveTab({
            enabledParams: { ...enabledParams, [key]: enabled }
        });
    };

    const handleValueChange = (key: string, value: any) => {
        updateActiveTab({
            values: { ...values, [key]: value }
        });
    };

    const handleArrayItemChange = (key: string, index: number, value: string) => {
        const currentArray = [...(values[key] || [])];
        currentArray[index] = value;
        handleValueChange(key, currentArray);
    };

    const handleAddArrayItem = (key: string) => {
        handleValueChange(key, [...(values[key] || []), '']);
    };

    const handleRemoveArrayItem = (key: string, index: number) => {
        const currentArray = [...(values[key] || [])];
        currentArray.splice(index, 1);
        handleValueChange(key, currentArray);
    };

    return (
        <div className="mt-8 border-t border-zinc-200 dark:border-zinc-800 pt-6 px-1">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">Система урона (DamageSystem)</h3>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">Базовый класс</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">Здоровье, броня и модификаторы урона.</p>
                </div>
                {!isEnabled ? (
                    <Button variant="outline" size="sm" onClick={() => handleToggleAll(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Добавить
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-red-500" onClick={() => handleToggleAll(false)}>
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <div className="mb-10">
                {!isEnabled ? (
                    <div className="text-center text-xs text-zinc-500 py-6 border border-dashed rounded-md dark:border-zinc-800">
                        Нет настроек. Нажмите «Добавить».
                    </div>
                ) : (
                    <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col gap-4">
                        {allParams.map(param => {
                            const value = values[param.key] ?? param.defaultValue;
                            const paramEnabled = !!enabledParams[param.key];

                            return (
                                <div key={param.key}>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        {param.type === 'armor_modifier' && (
                                            <Checkbox
                                                checked={paramEnabled}
                                                onCheckedChange={(checked) => handleToggleParam(param.key, !!checked)}
                                            />
                                        )}
                                        <Label className={`text-xs font-medium ${paramEnabled ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-600'}`}>{param.label}</Label>
                                        {paramEnabled && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="w-3.5 h-3.5 cursor-help opacity-50 hover:opacity-100 transition-opacity text-zinc-400" />
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right">
                                                        <p className="max-w-[250px] text-sm">{param.description}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>

                                    {paramEnabled && param.type === 'number' && (
                                        <Input
                                            type="number"
                                            value={value}
                                            onChange={(e) => handleValueChange(param.key, Number(e.target.value))}
                                            className="h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-mono"
                                        />
                                    )}

                                    {paramEnabled && param.type === 'array_of_strings' && (
                                        <div className="flex flex-col gap-2">
                                            {(value || []).map((item: string, idx: number) => (
                                                <div key={idx} className="flex items-center gap-1">
                                                    <Input
                                                        value={item}
                                                        onChange={(e) => handleArrayItemChange(param.key, idx, e.target.value)}
                                                        placeholder="path\\to\\file.rvmat"
                                                        className="h-8 text-sm bg-white dark:bg-zinc-950 font-mono flex-1"
                                                    />
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500" onClick={() => handleRemoveArrayItem(param.key, idx)}>
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            {(!value || value.length === 0) && (
                                                <div className="text-[10px] text-zinc-500 italic pl-1">Список пуст</div>
                                            )}
                                            <Button variant="outline" size="sm" className="h-7 text-xs self-start mt-1" onClick={() => handleAddArrayItem(param.key)}>
                                                <Plus className="w-3 h-3 mr-1" /> Добавить элемент
                                            </Button>
                                        </div>
                                    )}

                                    {paramEnabled && param.type === 'armor_modifier' && (
                                        <div className="flex items-center gap-2">
                                            {['Health', 'Blood', 'Shock'].map((dmgType) => (
                                                <div key={dmgType} className="flex-1 flex flex-col gap-1">
                                                    <Label className="text-[10px] text-zinc-500 font-medium ml-1">{dmgType}</Label>
                                                    <Input
                                                        type="number"
                                                        value={value?.[dmgType] !== undefined ? value[dmgType] : 1.0}
                                                        min={0}
                                                        max={1}
                                                        step={0.05}
                                                        onChange={(e) => {
                                                            let val = Number(e.target.value);
                                                            val = Math.max(0, Math.min(1, val));
                                                            handleValueChange(param.key, { ...(value || { Health: 1.0, Blood: 1.0, Shock: 1.0 }), [dmgType]: val });
                                                        }}
                                                        className="h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-mono"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {paramEnabled && param.example && (
                                        <div className="mt-1">
                                            <span className="text-[10px] text-zinc-500 ml-1 block leading-tight">
                                                <span className="font-semibold text-zinc-400">Example:</span> {param.example}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
});

// ============================================================
// MAIN EDITOR PANEL
// ============================================================

export function EditorPanel() {
    const [openPopover, setOpenPopover] = useState(false);

    const configs = useAppStore(s => s.configs);
    const activeConfigId = useAppStore(s => s.activeConfigId);
    const renameConfig = useAppStore(s => s.renameConfig);
    const addTab = useAppStore(s => s.addTab);
    const renameTab = useAppStore(s => s.renameTab);
    const deleteTab = useAppStore(s => s.deleteTab);
    const setActiveTab = useAppStore(s => s.setActiveTab);
    const duplicateTab = useAppStore(s => s.duplicateTab);
    const updateActiveTab = useAppStore(s => s.updateActiveTab);
    const setBaseClass = useAppStore(s => s.setBaseClass);
    const applyPreset = useAppStore(s => s.applyPreset);
    const updateRequiredAddons = useAppStore(s => s.updateRequiredAddons);

    const config = configs.find(c => c.id === activeConfigId);

    if (!config) {
        return <div className="flex-1 bg-white dark:bg-zinc-950 flex items-center justify-center text-zinc-500 z-10 border-r border-zinc-200 dark:border-zinc-800">Выберите или создайте проект</div>;
    }

    const activeTab = config.classes.find(c => c.id === config.activeTabId) || config.classes[0];

    if (!activeTab) {
        return <div className="flex-1 bg-white dark:bg-zinc-950 flex items-center justify-center text-zinc-500 z-10 border-r border-zinc-200 dark:border-zinc-800">
            <Button onClick={() => addTab(config.id)}>Добавить класс</Button>
        </div>;
    }

    const handleToggle = (key: string, checked: boolean) => {
        const updates: Record<string, boolean> = { [key]: checked };
        if (key === 'male') updates['female'] = checked;
        if (key === 'female') updates['male'] = checked;

        updateActiveTab({
            enabledParams: { ...activeTab.enabledParams, ...updates }
        });
    };

    const handleValueChange = (key: string, value: any) => {
        updateActiveTab({
            values: { ...activeTab.values, [key]: value }
        });
    };

    const parseArrayInput = (type: string, valStr: string) => {
        if (type === 'array_of_strings') {
            return valStr.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (type === 'array_of_numbers') {
            return valStr.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
        }
        return valStr;
    }

    const handleArrayItemChange = (key: string, index: number, value: string) => {
        const currentArray = [...(activeTab.values[key] || [])];
        currentArray[index] = value;
        handleValueChange(key, currentArray);
    };

    const handleAddArrayItem = (key: string) => {
        handleValueChange(key, [...(activeTab.values[key] || []), '']);
    };

    const handleRemoveArrayItem = (key: string, index: number) => {
        const currentArray = [...(activeTab.values[key] || [])];
        currentArray.splice(index, 1);
        handleValueChange(key, currentArray);
    };

    const getArrayValueStr = (val: any) => {
        if (Array.isArray(val)) return val.join(', ');
        return '';
    }

    return (
        <div className="bg-white dark:bg-zinc-950 flex flex-col h-full z-10 min-w-0">
            {/* Project Header */}
            <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
                <Label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold ml-1 mb-1 block">Название файла / Проекта</Label>
                <Input
                    value={config.name}
                    onChange={(e) => renameConfig(config.id, e.target.value)}
                    className="font-semibold h-8 text-sm bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 transition-all"
                    placeholder="Название проекта"
                />
                <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                        <Label className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold ml-1">requiredAddons (CfgPatches)</Label>
                        <Button variant="ghost" size="sm" className="h-5 px-1 text-[10px] text-zinc-400" onClick={() => {
                            updateRequiredAddons(config.id, [...(config.requiredAddons || []), '']);
                        }}>
                            <Plus className="w-3 h-3 mr-0.5" /> Добавить
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {(config.requiredAddons || ['DZ_Data', 'DZ_Characters']).map((addon, idx) => (
                            <div key={idx} className="flex items-center gap-0 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md">
                                <Input
                                    value={addon}
                                    onChange={(e) => {
                                        const updated = [...(config.requiredAddons || [])];
                                        updated[idx] = e.target.value;
                                        updateRequiredAddons(config.id, updated);
                                    }}
                                    className="h-6 w-[120px] text-[11px] font-mono border-0 px-2 bg-transparent"
                                    placeholder="DZ_Data"
                                />
                                <button className="h-6 w-5 flex items-center justify-center text-zinc-400 hover:text-red-500 shrink-0" onClick={() => {
                                    const updated = (config.requiredAddons || []).filter((_, i) => i !== idx);
                                    updateRequiredAddons(config.id, updated);
                                }}>
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs Header */}
            <div className="flex items-center overflow-x-auto overflow-y-hidden border-b border-zinc-200 dark:border-zinc-800 bg-transparent px-2 pt-2 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shrink-0">
                {config.classes.map(cls => (
                    <div
                        key={cls.id}
                        className={`group flex items-center h-8 px-3 rounded-t-md text-xs font-medium cursor-pointer border border-b-0 transition-colors shrink-0 max-w-[200px] ${config.activeTabId === cls.id
                            ? 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-blue-600 dark:text-blue-400 translate-y-px z-10'
                            : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                            }`}
                        onClick={() => setActiveTab(config.id, cls.id)}
                    >
                        <span className="truncate">{cls.className}</span>
                        {config.classes.length > 1 && (
                            <X
                                className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity shrink-0"
                                onClick={(e) => { e.stopPropagation(); deleteTab(config.id, cls.id); }}
                            />
                        )}
                    </div>
                ))}
                <div
                    className="flex items-center justify-center h-8 px-2 ml-1 cursor-pointer text-zinc-400 hover:text-blue-500 transition-colors shrink-0"
                    onClick={() => addTab(config.id)}
                    title="Добавить новый класс в этот файл"
                >
                    <PlusCircle className="w-4 h-4" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-14 pt-4">
                {/* Active Tab Logic */}
                <div className="flex gap-2 mb-4">
                    <div className="flex-1">
                        <Label className="text-xs text-zinc-500 ml-1">Имя класса</Label>
                        <Input
                            value={activeTab.className}
                            onChange={(e) => renameTab(config.id, activeTab.id, e.target.value)}
                            className="font-semibold h-9 mt-1 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 transition-all"
                            placeholder="Название класса"
                        />
                    </div>
                    <div className="flex-1">
                        <Label className="text-xs text-zinc-500 ml-1">Базовый класс (наследуется от)</Label>
                        <Input
                            value={activeTab.baseClass || ''}
                            onChange={(e) => setBaseClass(config.id, activeTab.id, e.target.value)}
                            className="font-mono text-sm h-9 mt-1 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 transition-all"
                            placeholder={`${activeTab.className.replace(/[^a-zA-Z0-9_]/g, '')} _Base`}
                        />
                    </div>
                </div>

                <div className="flex gap-2 pb-4 mb-4 border-b border-zinc-100 dark:border-zinc-800 justify-between items-end">
                    <div className="flex flex-col">
                        <p className="text-xs text-zinc-500 mb-2">Заполнить: </p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 text-xs">Presets <ChevronDown className="w-3 h-3 ml-1" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={() => applyPreset('clothing')}>Clothing</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-500" onClick={() => duplicateTab(config.id, activeTab.id)}>
                        <Copy className="w-3 h-3 mr-1" /> Дублировать вкладку
                    </Button>
                </div>


                <TooltipProvider>
                    <div className="flex items-center justify-between mb-4 mt-2 px-1">
                        <div>
                            <h3 className="text-sm font-semibold">Параметры класса</h3>
                            <p className="text-xs text-zinc-500 mt-1">Добавьте нужные параметры для генерации.</p>
                        </div>
                        <Popover open={openPopover} onOpenChange={setOpenPopover}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8">
                                    <Plus className="w-4 h-4 mr-2" /> Добавить параметр
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0" align="end">
                                <Command>
                                    <CommandInput placeholder="Поиск параметра..." className="h-9 text-xs" />
                                    <CommandList className="max-h-[300px]">
                                        <CommandEmpty className="py-2 text-xs text-center text-zinc-500">Ничего не найдено.</CommandEmpty>
                                        {CATALOG.filter(c => c.id !== 'animEvents' && c.id !== 'damageSystem' && c.id !== 'clothingTypes').map(category => {
                                            const unused = category.params.filter(p => {
                                                if (p.key === 'female' || p.key === 'proxyInventorySlot') return false;
                                                return !activeTab.enabledParams[p.key];
                                            });
                                            if (unused.length === 0) return null;
                                            return (
                                                <CommandGroup key={category.id} heading={category.title}>
                                                    {unused.map(param => (
                                                        <CommandItem
                                                            key={param.key}
                                                            onSelect={() => {
                                                                handleToggle(param.key, true);
                                                                setOpenPopover(false);
                                                            }}
                                                            className="text-xs flex flex-col items-start gap-1 py-2 cursor-pointer"
                                                        >
                                                            <div className="font-medium text-blue-600 dark:text-blue-400">
                                                                {param.key === 'male' ? 'Male & Female Models' : param.key === 'proxyModelName' ? 'Proxy Model & Slots' : param.label}
                                                            </div>
                                                            <div className="text-[10px] text-zinc-500 line-clamp-1">
                                                                {param.key === 'male' ? 'Добавить мужскую и женскую модели одежды' : param.key === 'proxyModelName' ? 'Добавить название прокси и слоты инвентаря' : param.description}
                                                            </div>
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            );
                                        })}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex flex-col gap-6 pb-10 px-1">
                        {CATALOG.every(c => c.params.filter(p => activeTab.enabledParams[p.key]).length === 0) && (
                            <div className="text-center text-xs text-zinc-500 py-8 border border-dashed rounded-md dark:border-zinc-800">
                                Нет добавленных параметров. Нажмите "Добавить параметр", чтобы начать.
                            </div>
                        )}

                        {CATALOG.filter(c => c.id !== 'animEvents' && c.id !== 'damageSystem' && c.id !== 'clothingTypes').map(category => {
                            const enabledInCat = category.params.filter(p => activeTab.enabledParams[p.key]);
                            if (enabledInCat.length === 0) return null;

                            return (
                                <div key={category.id} className="flex flex-col gap-3">
                                    <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider pl-1">
                                        {category.title}
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        {enabledInCat.map(param => {
                                            // Skip rendering the tied parameter separately
                                            if (param.key === 'female' || param.key === 'proxyInventorySlot') return null;

                                            const value = activeTab.values[param.key] ?? param.defaultValue;

                                            // Handle tied parameters visually
                                            let tiedParam = null;
                                            let tiedValue = null;
                                            if (param.key === 'male') {
                                                tiedParam = category.params.find(p => p.key === 'female');
                                                tiedValue = activeTab.values['female'] ?? tiedParam?.defaultValue;
                                            } else if (param.key === 'proxyModelName') {
                                                tiedParam = category.params.find(p => p.key === 'proxyInventorySlot');
                                                tiedValue = activeTab.values['proxyInventorySlot'] ?? tiedParam?.defaultValue;
                                            }

                                            return (
                                                <div key={param.key} className="flex flex-col gap-2 p-3 rounded-lg border border-blue-200 bg-blue-50/30 dark:border-blue-900/30 dark:bg-blue-900/10 shadow-sm transition-all duration-200">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Label className="font-medium text-sm text-blue-950 dark:text-blue-100">
                                                                {param.label}
                                                            </Label>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <HelpCircle className="w-4 h-4 cursor-help opacity-50 hover:opacity-100 transition-opacity text-blue-400" />
                                                                </TooltipTrigger>
                                                                <TooltipContent side="right">
                                                                    <p className="max-w-[250px] text-sm">{param.description}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-400 hover:text-red-500 -mr-1" onClick={() => handleToggle(param.key, false)}>
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="pl-1">
                                                        {param.type === 'string' && (
                                                            <Input
                                                                value={value}
                                                                onChange={(e) => handleValueChange(param.key, e.target.value)}
                                                                className="h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-mono"
                                                            />
                                                        )}
                                                        {param.type === 'number' && (
                                                            <Input
                                                                type="number"
                                                                value={value}
                                                                min={param.key === 'scope' ? 0 : undefined}
                                                                max={param.key === 'scope' ? 2 : undefined}
                                                                onChange={(e) => {
                                                                    let val = Number(e.target.value);
                                                                    if (param.key === 'scope') {
                                                                        val = Math.max(0, Math.min(2, Math.floor(val)));
                                                                    }
                                                                    handleValueChange(param.key, val);
                                                                }}
                                                                className="h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-mono"
                                                            />
                                                        )}
                                                        {param.type === 'armor_modifier' && (
                                                            <div className="flex items-center gap-2">
                                                                {['Health', 'Blood', 'Shock'].map((dmgType) => (
                                                                    <div key={dmgType} className="flex-1 flex flex-col gap-1">
                                                                        <Label className="text-[10px] text-zinc-500 font-medium ml-1">{dmgType}</Label>
                                                                        <Input
                                                                            type="number"
                                                                            value={value?.[dmgType] !== undefined ? value[dmgType] : 1.0}
                                                                            min={0}
                                                                            max={1}
                                                                            step={0.05}
                                                                            onChange={(e) => {
                                                                                let val = Number(e.target.value);
                                                                                val = Math.max(0, Math.min(1, val));
                                                                                handleValueChange(param.key, { ...(value || { Health: 1.0, Blood: 1.0, Shock: 1.0 }), [dmgType]: val });
                                                                            }}
                                                                            className="h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-mono"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {param.type === 'anim_event' && (
                                                            <Select
                                                                value={value?.soundSet || param.defaultValue?.soundSet || ""}
                                                                onValueChange={(newSoundSet) => {
                                                                    const opt = param.options?.find(o => o.soundSet === newSoundSet);
                                                                    if (opt) {
                                                                        handleValueChange(param.key, { soundSet: opt.soundSet, id: opt.id });
                                                                    }
                                                                }}
                                                            >
                                                                <SelectTrigger className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                                                    <SelectValue placeholder="Выберите звук..." />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {param.options?.map((opt) => (
                                                                        <SelectItem key={opt.soundSet} value={opt.soundSet}>
                                                                            {opt.label} ({opt.soundSet})
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                        {param.type === 'array_of_strings' && (
                                                            <div className="flex flex-col gap-2 mt-1">
                                                                <div className="flex flex-col gap-2">
                                                                    {(value || []).map((item: string, idx: number) => (
                                                                        <div key={idx} className="flex items-center gap-1">
                                                                            <Input
                                                                                value={item}
                                                                                onChange={(e) => handleArrayItemChange(param.key, idx, e.target.value)}
                                                                                placeholder="Значение..."
                                                                                className="h-8 text-sm bg-white dark:bg-zinc-950 font-mono flex-1"
                                                                            />
                                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500" onClick={() => handleRemoveArrayItem(param.key, idx)}>
                                                                                <X className="w-4 h-4" />
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                    {(!value || value.length === 0) && (
                                                                        <div className="text-[10px] text-zinc-500 italic pl-1">Список пуст</div>
                                                                    )}
                                                                </div>
                                                                <Button variant="outline" size="sm" className="h-7 text-xs self-start mt-1" onClick={() => handleAddArrayItem(param.key)}>
                                                                    <Plus className="w-3 h-3 mr-1" /> Добавить элемент
                                                                </Button>
                                                            </div>
                                                        )}
                                                        {param.type === 'array_of_numbers' && (
                                                            <div className="flex flex-col gap-1.5">
                                                                <Input
                                                                    value={getArrayValueStr(value)}
                                                                    onChange={(e) => handleValueChange(param.key, parseArrayInput(param.type, e.target.value))}
                                                                    placeholder="Comma separated values"
                                                                    className="h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-mono"
                                                                />
                                                            </div>
                                                        )}

                                                        {param.example && (
                                                            <div className="mt-1">
                                                                <span className="text-[10px] text-zinc-500 ml-1 block leading-tight">
                                                                    <span className="font-semibold text-zinc-400">Example:</span> {param.example}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {tiedParam && (
                                                            <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                                                <div className="flex items-center gap-2">
                                                                    <Label className="font-medium text-sm text-blue-950 dark:text-blue-100">
                                                                        {tiedParam.label}
                                                                    </Label>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <HelpCircle className="w-4 h-4 cursor-help opacity-50 hover:opacity-100 transition-opacity text-blue-400" />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent side="right">
                                                                            <p className="max-w-[250px] text-sm">{tiedParam.description}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </div>

                                                                <div className="pl-1">
                                                                    {tiedParam.type === 'string' && (
                                                                        <Input
                                                                            value={tiedValue}
                                                                            onChange={(e) => handleValueChange(tiedParam.key, e.target.value)}
                                                                            className="h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                                                                        />
                                                                    )}
                                                                    {tiedParam.type === 'array_of_strings' && (
                                                                        <div className="flex flex-col gap-2 mt-1">
                                                                            <div className="flex flex-col gap-2">
                                                                                {(tiedValue || []).map((item: string, idx: number) => (
                                                                                    <div key={idx} className="flex items-center gap-1">
                                                                                        <Input
                                                                                            value={item}
                                                                                            onChange={(e) => handleArrayItemChange(tiedParam.key, idx, e.target.value)}
                                                                                            placeholder="Значение..."
                                                                                            className="h-8 text-sm bg-white dark:bg-zinc-950 font-mono flex-1"
                                                                                        />
                                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-500" onClick={() => handleRemoveArrayItem(tiedParam.key, idx)}>
                                                                                            <X className="w-4 h-4" />
                                                                                        </Button>
                                                                                    </div>
                                                                                ))}
                                                                                {(!tiedValue || tiedValue.length === 0) && (
                                                                                    <div className="text-[10px] text-zinc-500 italic pl-1">Список пуст</div>
                                                                                )}
                                                                            </div>
                                                                            <Button variant="outline" size="sm" className="h-7 text-xs self-start mt-1" onClick={() => handleAddArrayItem(tiedParam.key)}>
                                                                                <Plus className="w-3 h-3 mr-1" /> Добавить элемент
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {tiedParam.example && (
                                                                    <div className="mt-1">
                                                                        <span className="text-[10px] text-zinc-500 ml-1 block leading-tight">
                                                                            <span className="font-semibold text-zinc-400">Example:</span> {tiedParam.example}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Memoized sub-sections */}
                    <ClothingTypesSection
                        enabledParams={activeTab.enabledParams}
                        values={activeTab.values}
                        configId={config.id}
                        tabId={activeTab.id}
                    />
                    <DamageSystemSection
                        enabledParams={activeTab.enabledParams}
                        values={activeTab.values}
                        configId={config.id}
                        tabId={activeTab.id}
                    />
                    <AnimEventsSection
                        enabledParams={activeTab.enabledParams}
                        values={activeTab.values}
                        configId={config.id}
                        tabId={activeTab.id}
                    />
                    <RetexturesSection
                        children={activeTab.children || []}
                        configId={config.id}
                        tabId={activeTab.id}
                        className={activeTab.className}
                    />
                    <SlotsSection
                        slots={activeTab.slots || []}
                        configId={config.id}
                        tabId={activeTab.id}
                    />
                    <ProxiesSection
                        proxies={activeTab.proxies || []}
                        configId={config.id}
                        tabId={activeTab.id}
                    />
                </TooltipProvider>
            </div>
        </div>
    );
}
