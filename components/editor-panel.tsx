"use client";

import { useState, memo } from "react";
import { useAppStore, ChildClassData, SlotData, ProxyData } from "@/lib/store";
import { CATALOG } from "@/lib/catalog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { HelpCircle, ChevronDown, Plus, Trash, X, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { MultiSelect } from "./ui/multi-select";
import { ComboBox } from "./ui/combobox";

// ─────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────

function SectionBadge({ label }: { label: string }) {
  return (
    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 select-none">
      {label}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center text-xs text-zinc-400 dark:text-zinc-500 py-7 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg">
      {message}
    </div>
  );
}

// ─────────────────────────────────────────────
// SLOTS SECTION
// ─────────────────────────────────────────────

const SlotsSection = memo(function SlotsSection({
  slots,
  configId,
  tabId,
}: {
  slots: SlotData[];
  configId: string;
  tabId: string;
}) {
  const addSlot = useAppStore((s) => s.addSlot);
  const updateSlot = useAppStore((s) => s.updateSlot);
  const deleteSlot = useAppStore((s) => s.deleteSlot);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Слоты (CfgSlots)</CardTitle>
            <CardDescription>
              Определение слотов для прикрепления предметов.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            onClick={() => addSlot(configId, tabId)}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Добавить
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {slots.length === 0 && (
            <EmptyState message="Нет слотов. Нажмите «Добавить»." />
          )}
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 flex flex-col gap-3"
            >
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label className="text-xs text-zinc-500 mb-1 block">
                    Имя слота
                  </Label>
                  <div className="flex items-center">
                    <span className="h-8 px-2 flex items-center text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border border-r-0 border-zinc-200 dark:border-zinc-700 rounded-l-md text-zinc-500 select-none">
                      Slot_
                    </span>
                    <Input
                      value={slot.slotName}
                      onChange={(e) =>
                        updateSlot(configId, tabId, slot.id, {
                          slotName: e.target.value,
                        })
                      }
                      className="h-8 text-sm font-mono rounded-l-none"
                      placeholder="weaponHandguardAK"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-red-500 shrink-0"
                  onClick={() => deleteSlot(configId, tabId, slot.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <Label className="text-xs text-zinc-500 mb-1 block">
                  displayName
                </Label>
                <Input
                  value={slot.displayName}
                  onChange={(e) =>
                    updateSlot(configId, tabId, slot.id, {
                      displayName: e.target.value,
                    })
                  }
                  className="h-8 text-sm font-mono"
                  placeholder="#STR_CfgHandguard0"
                />
              </div>

              <div>
                <Label className="text-xs text-zinc-500 mb-1 block">
                  ghostIcon
                </Label>
                <div className="flex items-center">
                  <span className="h-8 px-2 flex items-center text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border border-r-0 border-zinc-200 dark:border-zinc-700 rounded-l-md text-zinc-500 select-none shrink-0">
                    set:
                  </span>
                  <Input
                    value={slot.ghostIconSet}
                    onChange={(e) =>
                      updateSlot(configId, tabId, slot.id, {
                        ghostIconSet: e.target.value,
                      })
                    }
                    className="h-8 text-sm font-mono rounded-none border-r-0"
                    placeholder="dayz_inventory"
                  />
                  <span className="h-8 px-2 flex items-center text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border border-r-0 border-zinc-200 dark:border-zinc-700 text-zinc-500 select-none shrink-0">
                    image:
                  </span>
                  <Input
                    value={slot.ghostIconImage}
                    onChange={(e) =>
                      updateSlot(configId, tabId, slot.id, {
                        ghostIconImage: e.target.value,
                      })
                    }
                    className="h-8 text-sm font-mono rounded-l-none"
                    placeholder="handguard"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

// ─────────────────────────────────────────────
// PROXIES SECTION
// ─────────────────────────────────────────────

const ProxiesSection = memo(function ProxiesSection({
  proxies,
  configId,
  tabId,
}: {
  proxies: ProxyData[];
  configId: string;
  tabId: string;
}) {
  const addProxy = useAppStore((s) => s.addProxy);
  const updateProxy = useAppStore((s) => s.updateProxy);
  const deleteProxy = useAppStore((s) => s.deleteProxy);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Прокси объекты (CfgNonAIVehicles)</CardTitle>
            <CardDescription>
              Объявление прикрепляемых частей (ProxyAttachment).
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            onClick={() => addProxy(configId, tabId)}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Добавить
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {proxies.length === 0 && (
            <EmptyState message="Нет прокси. Нажмите «Добавить»." />
          )}
          {proxies.map((proxy) => (
            <div
              key={proxy.id}
              className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 flex flex-col gap-3"
            >
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label className="text-xs text-zinc-500 mb-1 block">
                    Имя прокси
                  </Label>
                  <div className="flex items-center">
                    <span className="h-8 px-2 flex items-center text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border border-r-0 border-zinc-200 dark:border-zinc-700 rounded-l-md text-zinc-500 select-none">
                      Proxy
                    </span>
                    <Input
                      value={proxy.proxyName}
                      onChange={(e) =>
                        updateProxy(configId, tabId, proxy.id, {
                          proxyName: e.target.value,
                        })
                      }
                      className="h-8 text-sm font-mono rounded-l-none"
                      placeholder="belt_back_proxy"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-red-500 shrink-0"
                  onClick={() => deleteProxy(configId, tabId, proxy.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs text-zinc-500">inventorySlot</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() =>
                      updateProxy(configId, tabId, proxy.id, {
                        inventorySlots: [...proxy.inventorySlots, ""],
                      })
                    }
                  >
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
                          updateProxy(configId, tabId, proxy.id, {
                            inventorySlots: updated,
                          });
                        }}
                        className="h-8 text-xs font-mono"
                        placeholder="Material_L1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-red-500 shrink-0"
                        onClick={() => {
                          const updated = proxy.inventorySlots.filter(
                            (_, i) => i !== idx,
                          );
                          updateProxy(configId, tabId, proxy.id, {
                            inventorySlots: updated,
                          });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {proxy.inventorySlots.length === 0 && (
                    <p className="text-[10px] text-zinc-400 italic">
                      Нет слотов
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

// ─────────────────────────────────────────────
// RETEXTURES SECTION
// ─────────────────────────────────────────────

const RetexturesSection = memo(function RetexturesSection({
  children,
  configId,
  tabId,
  className,
}: {
  children: ChildClassData[];
  configId: string;
  tabId: string;
  className: string;
}) {
  const addChildClass = useAppStore((s) => s.addChildClass);
  const updateChildClass = useAppStore((s) => s.updateChildClass);
  const deleteChildClass = useAppStore((s) => s.deleteChildClass);

  const handleChildArrayChange = (
    childId: string,
    field: "hiddenSelectionsTextures" | "hiddenSelectionsMaterials",
    index: number,
    value: string,
  ) => {
    const child = children?.find((c) => c.id === childId);
    if (!child) return;
    const newArray = [...(child[field] || [])];
    newArray[index] = value;
    updateChildClass(configId, tabId, childId, { [field]: newArray });
  };

  const handleAddChildArrayItem = (
    childId: string,
    field: "hiddenSelectionsTextures" | "hiddenSelectionsMaterials",
  ) => {
    const child = children?.find((c) => c.id === childId);
    if (!child) return;
    updateChildClass(configId, tabId, childId, {
      [field]: [...(child[field] || []), ""],
    });
  };

  const handleRemoveChildArrayItem = (
    childId: string,
    field: "hiddenSelectionsTextures" | "hiddenSelectionsMaterials",
    index: number,
  ) => {
    const child = children?.find((c) => c.id === childId);
    if (!child) return;
    const newArray = [...(child[field] || [])];
    newArray.splice(index, 1);
    updateChildClass(configId, tabId, childId, { [field]: newArray });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Варианты / Ретекстуры</CardTitle>
            <CardDescription>
              Дочерние классы, наследующие параметры этого класса.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 shrink-0"
            onClick={() =>
              addChildClass(configId, tabId, `${className}_Variant`)
            }
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Добавить
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {(!children || children.length === 0) && (
            <EmptyState message="Нет ретекстур. Нажмите «Добавить»." />
          )}
          {children?.map((child) => (
            <div
              key={child.id}
              className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 flex flex-col gap-3 relative group"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-500"
                onClick={() => deleteChildClass(configId, tabId, child.id)}
              >
                <Trash className="w-3.5 h-3.5" />
              </Button>

              <div className="flex gap-3 pr-8">
                <div className="flex-1">
                  <Label className="text-xs text-zinc-500 mb-1 block">
                    Имя класса
                  </Label>
                  <Input
                    value={child.name}
                    onChange={(e) =>
                      updateChildClass(configId, tabId, child.id, {
                        name: e.target.value,
                      })
                    }
                    className="h-8 text-sm font-semibold"
                  />
                </div>
                <div className="w-24">
                  <Label className="text-xs text-zinc-500 mb-1 block">
                    Scope
                  </Label>
                  <Input
                    type="number"
                    value={child.scope}
                    min={0}
                    max={2}
                    onChange={(e) => {
                      const val = Math.max(
                        0,
                        Math.min(2, Number(e.target.value)),
                      );
                      updateChildClass(configId, tabId, child.id, {
                        scope: val,
                      });
                    }}
                    className="h-8 text-sm font-mono"
                  />
                </div>
                <div className="w-28">
                  <Label className="text-[10px] uppercase text-zinc-500 mb-1 block">
                    Visibility Mod.
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={child.visibilityModifier ?? 1.0}
                    onChange={(e) =>
                      updateChildClass(configId, tabId, child.id, {
                        visibilityModifier: Number(e.target.value),
                      })
                    }
                    className="h-8 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                {(
                  [
                    "hiddenSelectionsTextures",
                    "hiddenSelectionsMaterials",
                  ] as const
                ).map((field) => (
                  <div key={field} className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-zinc-500">
                        {field === "hiddenSelectionsTextures"
                          ? "Текстуры"
                          : "Материалы"}
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleAddChildArrayItem(child.id, field)}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Добавить
                      </Button>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {(child[field] || []).map((val, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Input
                            value={val}
                            onChange={(e) =>
                              handleChildArrayChange(
                                child.id,
                                field,
                                idx,
                                e.target.value,
                              )
                            }
                            className="h-7 text-xs font-mono"
                            placeholder={
                              field === "hiddenSelectionsTextures"
                                ? "path\\to\\texture.paa"
                                : "path\\to\\material.rvmat"
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-zinc-400 hover:text-red-500 shrink-0"
                            onClick={() =>
                              handleRemoveChildArrayItem(child.id, field, idx)
                            }
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ))}
                      {(!child[field] || child[field].length === 0) && (
                        <p className="text-[10px] text-zinc-400 italic">
                          Пусто
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

// ─────────────────────────────────────────────
// ANIM EVENTS SECTION
// ─────────────────────────────────────────────

const AnimEventsSection = memo(function AnimEventsSection({
  enabledParams,
  values,
  configId,
  tabId,
}: {
  enabledParams: Record<string, boolean>;
  values: Record<string, any>;
  configId: string;
  tabId: string;
}) {
  const updateActiveTab = useAppStore((s) => s.updateActiveTab);
  const animCategory = CATALOG.find((c) => c.id === "animEvents");
  if (!animCategory) return null;

  const allParams = animCategory.params;
  const isEnabled = allParams.some((p) => enabledParams[p.key]);

  const handleToggleAll = (enabled: boolean) => {
    const updates: Record<string, boolean> = {};
    allParams.forEach((p) => {
      updates[p.key] = enabled;
    });
    updateActiveTab({ enabledParams: { ...enabledParams, ...updates } });
  };

  const handleValueChange = (key: string, value: any) => {
    updateActiveTab({ values: { ...values, [key]: value } });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Звуковые события (AnimEvents)</CardTitle>
              <SectionBadge label="Базовый класс" />
            </div>
            <CardDescription>
              Звуки взаимодействия с предметом (SoundWeapon).
            </CardDescription>
          </div>
          {!isEnabled ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 shrink-0"
              onClick={() => handleToggleAll(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Добавить
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-zinc-400 hover:text-red-500"
              onClick={() => handleToggleAll(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEnabled ? (
          <EmptyState message="Нет добавленных звуков. Нажмите «Добавить»." />
        ) : (
          <div className="flex flex-col gap-4">
            {allParams.map((param) => {
              const val = values[param.key] ?? param.defaultValue;
              return (
                <div key={param.key}>
                  <Label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                    {param.label}
                  </Label>
                  <Select
                    value={val?.soundSet || param.defaultValue?.soundSet || ""}
                    onValueChange={(newSoundSet) => {
                      const opt = param.options?.find(
                        (o) => o.soundSet === newSoundSet,
                      );
                      if (opt) {
                        handleValueChange(param.key, {
                          soundSet: opt.soundSet,
                          id: opt.id,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
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
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

// ─────────────────────────────────────────────
// CLOTHING TYPES SECTION
// ─────────────────────────────────────────────

const ClothingTypesSection = memo(function ClothingTypesSection({
  enabledParams,
  values,
  configId,
  tabId,
}: {
  enabledParams: Record<string, boolean>;
  values: Record<string, any>;
  configId: string;
  tabId: string;
}) {
  const updateActiveTab = useAppStore((s) => s.updateActiveTab);
  const clothCategory = CATALOG.find((c) => c.id === "clothingTypes");
  if (!clothCategory) return null;

  const allParams = clothCategory.params;
  const isEnabled = allParams.some((p) => enabledParams[p.key]);

  const handleToggleAll = (enabled: boolean) => {
    const updates: Record<string, boolean> = {};
    allParams.forEach((p) => {
      updates[p.key] = enabled;
    });
    updateActiveTab({ enabledParams: { ...enabledParams, ...updates } });
  };

  const handleValueChange = (key: string, value: any) => {
    updateActiveTab({ values: { ...values, [key]: value } });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Типы одежды (ClothingTypes)</CardTitle>
              <SectionBadge label="Базовый класс" />
            </div>
            <CardDescription>
              Пути к моделям мужских и женских персонажей.
            </CardDescription>
          </div>
          {!isEnabled ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 shrink-0"
              onClick={() => handleToggleAll(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Добавить
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-zinc-400 hover:text-red-500"
              onClick={() => handleToggleAll(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEnabled ? (
          <EmptyState message="Нет настроек. Нажмите «Добавить»." />
        ) : (
          <div className="flex flex-col gap-4">
            {allParams.map((param) => {
              const value = values[param.key] ?? param.defaultValue;
              return (
                <div key={param.key}>
                  <Label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 block">
                    {param.label}
                  </Label>
                  <Input
                    value={value}
                    onChange={(e) =>
                      handleValueChange(param.key, e.target.value)
                    }
                    placeholder={param.description}
                    className="h-8 text-sm font-mono"
                  />
                  {param.example && (
                    <p className="text-[10px] text-zinc-400 mt-1">
                      <span className="font-medium">Example:</span>{" "}
                      {param.example}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

// ─────────────────────────────────────────────
// DAMAGE SYSTEM SECTION
// ─────────────────────────────────────────────

const DamageSystemSection = memo(function DamageSystemSection({
  enabledParams,
  values,
  configId,
  tabId,
}: {
  enabledParams: Record<string, boolean>;
  values: Record<string, any>;
  configId: string;
  tabId: string;
}) {
  const updateActiveTab = useAppStore((s) => s.updateActiveTab);
  const dmgCategory = CATALOG.find((c) => c.id === "damageSystem");
  if (!dmgCategory) return null;

  const allParams = dmgCategory.params;
  const isEnabled = allParams.some((p) => enabledParams[p.key]);

  const handleToggleAll = (enabled: boolean) => {
    const updates: Record<string, boolean> = {};
    allParams.forEach((p) => {
      updates[p.key] = enabled;
    });
    updateActiveTab({ enabledParams: { ...enabledParams, ...updates } });
  };

  const handleToggleParam = (key: string, enabled: boolean) => {
    updateActiveTab({
      enabledParams: { ...enabledParams, [key]: enabled },
    });
  };

  const handleValueChange = (key: string, value: any) => {
    updateActiveTab({ values: { ...values, [key]: value } });
  };

  const handleArrayItemChange = (key: string, index: number, value: string) => {
    const arr = [...(values[key] || [])];
    arr[index] = value;
    handleValueChange(key, arr);
  };

  const handleAddArrayItem = (key: string) => {
    handleValueChange(key, [...(values[key] || []), ""]);
  };

  const handleRemoveArrayItem = (key: string, index: number) => {
    const arr = [...(values[key] || [])];
    arr.splice(index, 1);
    handleValueChange(key, arr);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Система урона (DamageSystem)</CardTitle>
              <SectionBadge label="Базовый класс" />
            </div>
            <CardDescription>
              Здоровье, броня и модификаторы урона.
            </CardDescription>
          </div>
          {!isEnabled ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 shrink-0"
              onClick={() => handleToggleAll(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Добавить
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-zinc-400 hover:text-red-500"
              onClick={() => handleToggleAll(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isEnabled ? (
          <EmptyState message="Нет настроек. Нажмите «Добавить»." />
        ) : (
          <div className="flex flex-col gap-5">
            {allParams.map((param) => {
              const value = values[param.key] ?? param.defaultValue;
              const paramEnabled = !!enabledParams[param.key];
              return (
                <div key={param.key}>
                  <div className="flex items-center gap-2 mb-2">
                    {param.type === "armor_modifier" && (
                      <Checkbox
                        checked={paramEnabled}
                        onCheckedChange={(checked) =>
                          handleToggleParam(param.key, !!checked)
                        }
                      />
                    )}
                    <Label
                      className={`text-xs font-medium ${
                        paramEnabled
                          ? "text-zinc-700 dark:text-zinc-300"
                          : "text-zinc-400 dark:text-zinc-600"
                      }`}
                    >
                      {param.label}
                    </Label>
                    {paramEnabled && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-3.5 h-3.5 cursor-help text-zinc-400 hover:text-zinc-600 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="max-w-62.5 text-sm">
                              {param.description}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>

                  {paramEnabled && param.type === "number" && (
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        handleValueChange(param.key, Number(e.target.value))
                      }
                      className="h-8 text-sm font-mono"
                    />
                  )}

                  {paramEnabled && param.type === "array_of_strings" && (
                    <div className="flex flex-col gap-2">
                      {(value || []).map((item: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Input
                            value={item}
                            onChange={(e) =>
                              handleArrayItemChange(
                                param.key,
                                idx,
                                e.target.value,
                              )
                            }
                            placeholder="path\\to\\file.rvmat"
                            className="h-8 text-sm font-mono flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-red-500"
                            onClick={() =>
                              handleRemoveArrayItem(param.key, idx)
                            }
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      {(!value || value.length === 0) && (
                        <p className="text-[10px] text-zinc-400 italic">
                          Список пуст
                        </p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs self-start"
                        onClick={() => handleAddArrayItem(param.key)}
                      >
                        <Plus className="w-3 h-3 mr-1" /> Добавить элемент
                      </Button>
                    </div>
                  )}

                  {paramEnabled && param.type === "armor_modifier" && (
                    <div className="flex items-center gap-2">
                      {["Health", "Blood", "Shock"].map((dmgType) => (
                        <div
                          key={dmgType}
                          className="flex-1 flex flex-col gap-1"
                        >
                          <Label className="text-[10px] text-zinc-500 font-medium">
                            {dmgType}
                          </Label>
                          <Input
                            type="number"
                            value={
                              value?.[dmgType] !== undefined
                                ? value[dmgType]
                                : 1.0
                            }
                            min={0}
                            max={1}
                            step={0.05}
                            onChange={(e) => {
                              const val = Math.max(
                                0,
                                Math.min(1, Number(e.target.value)),
                              );
                              handleValueChange(param.key, {
                                ...(value || {
                                  Health: 1.0,
                                  Blood: 1.0,
                                  Shock: 1.0,
                                }),
                                [dmgType]: val,
                              });
                            }}
                            className="h-8 text-sm font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {paramEnabled && param.example && (
                    <p className="text-[10px] text-zinc-400 mt-1">
                      <span className="font-medium">Example:</span>{" "}
                      {param.example}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

// ─────────────────────────────────────────────
// MAIN EDITOR PANEL
// ─────────────────────────────────────────────

export function EditorPanel() {
  const [openPopover, setOpenPopover] = useState(false);
  const [newAddonInput, setNewAddonInput] = useState("");

  const configs = useAppStore((s) => s.configs);
  const activeConfigId = useAppStore((s) => s.activeConfigId);
  const addConfig = useAppStore((s) => s.addConfig);
  const renameConfig = useAppStore((s) => s.renameConfig);
  const addTab = useAppStore((s) => s.addTab);
  const renameTab = useAppStore((s) => s.renameTab);
  const deleteTab = useAppStore((s) => s.deleteTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const duplicateTab = useAppStore((s) => s.duplicateTab);
  const updateActiveTab = useAppStore((s) => s.updateActiveTab);
  const setBaseClass = useAppStore((s) => s.setBaseClass);
  const applyPreset = useAppStore((s) => s.applyPreset);
  const updateRequiredAddons = useAppStore((s) => s.updateRequiredAddons);

  const config = configs.find((c) => c.id === activeConfigId);

  // ── Empty states ──
  if (!config) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-400">Нет открытых проектов</p>
        <Button onClick={() => addConfig()}>
          <Plus className="w-4 h-4 mr-2" /> Создать проект
        </Button>
      </div>
    );
  }

  const activeTab =
    config.classes.find((c) => c.id === config.activeTabId) ||
    config.classes[0];

  if (!activeTab) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-4 bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-400">Нет классов в проекте</p>
        <Button onClick={() => addTab(config.id)}>
          <Plus className="w-4 h-4 mr-2" /> Добавить класс
        </Button>
      </div>
    );
  }

  // ── Handlers ──
  const handleToggle = (key: string, checked: boolean) => {
    const updates: Record<string, boolean> = { [key]: checked };
    if (key === "male") updates["female"] = checked;
    if (key === "female") updates["male"] = checked;

    const nextValues = { ...activeTab.values };
    if (checked) {
      const allParams = CATALOG.flatMap((category) => category.params);
      const target = allParams.find((p) => p.key === key);
      if (target && nextValues[key] === undefined && target.defaultValue !== undefined) {
        nextValues[key] = target.defaultValue;
      }

      if (key === "male") {
        const femaleParam = allParams.find((p) => p.key === "female");
        if (
          femaleParam &&
          nextValues["female"] === undefined &&
          femaleParam.defaultValue !== undefined
        ) {
          nextValues["female"] = femaleParam.defaultValue;
        }
      }

      if (key === "female") {
        const maleParam = allParams.find((p) => p.key === "male");
        if (
          maleParam &&
          nextValues["male"] === undefined &&
          maleParam.defaultValue !== undefined
        ) {
          nextValues["male"] = maleParam.defaultValue;
        }
      }
    }

    updateActiveTab({
      enabledParams: { ...activeTab.enabledParams, ...updates },
      values: nextValues,
    });
  };

  const handleValueChange = (key: string, value: any) => {
    updateActiveTab({ values: { ...activeTab.values, [key]: value } });
  };

  const parseArrayInput = (type: string, valStr: string) => {
    if (type === "array_of_strings")
      return valStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    if (type === "array_of_numbers")
      return valStr
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n));
    return valStr;
  };

  const handleArrayItemChange = (key: string, index: number, value: string) => {
    const arr = [...(activeTab.values[key] || [])];
    arr[index] = value;
    handleValueChange(key, arr);
  };

  const handleAddArrayItem = (key: string) => {
    handleValueChange(key, [...(activeTab.values[key] || []), ""]);
  };

  const handleRemoveArrayItem = (key: string, index: number) => {
    const arr = [...(activeTab.values[key] || [])];
    arr.splice(index, 1);
    handleValueChange(key, arr);
  };

  const getArrayValueStr = (val: any) =>
    Array.isArray(val) ? val.join(", ") : "";

  const addAddon = () => {
    const trimmed = newAddonInput.trim();
    if (!trimmed) return;
    updateRequiredAddons(config.id, [
      ...(config.requiredAddons || []),
      trimmed,
    ]);
    setNewAddonInput("");
  };

  // ── Render ──
  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-10">
          {/* ════════════════════════════════════
              BLOCK 1 — PROJECT SETTINGS
          ════════════════════════════════════ */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки проекта</CardTitle>
              <CardDescription>
                Имя файла конфигурации и зависимости аддонов.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Project name */}
              <div>
                <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">
                  Название проекта
                </Label>
                <Input
                  value={config.name}
                  onChange={(e) => renameConfig(config.id, e.target.value)}
                  placeholder="MyDayZMod"
                  className="h-9 font-semibold"
                />
              </div>

              {/* Required addons */}
              <div>
                <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 block">
                  Required Addons{" "}
                  <span className="font-normal text-zinc-400">
                    (CfgPatches)
                  </span>
                </Label>

                {/* Tag list */}
                <div className="flex flex-wrap gap-1.5 mb-3 min-h-7">
                  {(config.requiredAddons || []).length === 0 && (
                    <span className="text-xs text-zinc-400 italic self-center">
                      Нет аддонов
                    </span>
                  )}
                  {(config.requiredAddons || []).map((addon, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="gap-1 pl-2.5 pr-1 py-0.5 text-xs font-mono rounded-full"
                    >
                      {addon}
                      <button
                        onClick={() => {
                          const updated = config.requiredAddons.filter(
                            (_, i) => i !== idx,
                          );
                          updateRequiredAddons(config.id, updated);
                        }}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                        aria-label="Remove addon"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>

                {/* Add new addon */}
                <div className="flex gap-2">
                  <Input
                    value={newAddonInput}
                    onChange={(e) => setNewAddonInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addAddon();
                    }}
                    placeholder="DZ_Data"
                    className="h-8 text-xs font-mono flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0"
                    disabled={!newAddonInput.trim()}
                    onClick={addAddon}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Добавить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ════════════════════════════════════
              BLOCK 2 — CLASSES
          ════════════════════════════════════ */}
          <Card>
            <CardHeader>
              <CardTitle>Классы</CardTitle>
              <CardDescription>
                Каждая вкладка — отдельный класс конфигурации.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Class tabs row */}
              <div className="flex flex-wrap items-center gap-1">
                {config.classes.map((cls) => (
                  <div
                    key={cls.id}
                    className={`group flex items-center h-8 px-3 rounded-md text-xs font-medium cursor-pointer border transition-all shrink-0 max-w-45 ${
                      config.activeTabId === cls.id
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent shadow-sm"
                        : "bg-white dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                    onClick={() => setActiveTab(config.id, cls.id)}
                  >
                    <span className="truncate">
                      {cls.className || "NewClass"}
                    </span>
                    {config.classes.length > 1 && (
                      <button
                        className="ml-2 rounded-sm opacity-0 group-hover:opacity-70 hover:opacity-100! transition-all shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTab(config.id, cls.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => addTab(config.id)}
                  title="Добавить новый класс"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Class name + base class */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">
                    Имя класса
                  </Label>
                  <Input
                    value={activeTab.className}
                    onChange={(e) =>
                      renameTab(config.id, activeTab.id, e.target.value)
                    }
                    placeholder="MyItemClass"
                    className="h-9 font-semibold"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 block">
                    Базовый класс
                  </Label>
                  <Input
                    value={activeTab.baseClass || ""}
                    onChange={(e) =>
                      setBaseClass(config.id, activeTab.id, e.target.value)
                    }
                    placeholder="Default_Base"
                    className="h-9 font-mono text-sm"
                  />
                </div>
              </div>

              {/* Preset + Duplicate */}
              <div className="flex items-center gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                <span className="text-xs text-zinc-400">Заполнить:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Presets <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => applyPreset("clothing")}>
                      Clothing
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-zinc-500"
                  onClick={() => duplicateTab(config.id, activeTab.id)}
                >
                  <Copy className="w-3 h-3 mr-1" /> Дублировать вкладку
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ════════════════════════════════════
              BLOCK 3 — CLASS PARAMETERS
          ════════════════════════════════════ */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>Параметры класса</CardTitle>
                  <CardDescription>
                    Добавьте нужные параметры для генерации конфига.
                  </CardDescription>
                </div>
                {/* Accent "Add Parameter" button */}
                <Popover open={openPopover} onOpenChange={setOpenPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      className="h-8 gap-1.5 shrink-0 bg-zinc-900 hover:bg-zinc-700 text-white dark:bg-zinc-100 dark:hover:bg-zinc-300 dark:text-zinc-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Добавить параметр
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-75 p-0" align="end">
                    <Command>
                      <CommandInput
                        placeholder="Поиск параметра..."
                        className="h-9 text-xs"
                      />
                      <CommandList className="max-h-75">
                        <CommandEmpty className="py-3 text-xs text-center text-zinc-500">
                          Ничего не найдено.
                        </CommandEmpty>
                        {CATALOG.filter(
                          (c) =>
                            c.id !== "animEvents" &&
                            c.id !== "damageSystem" &&
                            c.id !== "clothingTypes",
                        ).map((category) => {
                          const unused = category.params.filter((p) => {
                            if (
                              p.key === "female" ||
                              p.key === "proxyInventorySlot"
                            )
                              return false;
                            return !activeTab.enabledParams[p.key];
                          });
                          if (unused.length === 0) return null;
                          return (
                            <CommandGroup
                              key={category.id}
                              heading={category.title}
                            >
                              {unused.map((param) => (
                                <CommandItem
                                  key={param.key}
                                  onSelect={() => {
                                    handleToggle(param.key, true);
                                    setOpenPopover(false);
                                  }}
                                  className="text-xs flex flex-col items-start gap-0.5 py-2 cursor-pointer"
                                >
                                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                    {param.key === "male"
                                      ? "Male & Female Models"
                                      : param.key === "proxyModelName"
                                        ? "Proxy Model & Slots"
                                        : param.label}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 line-clamp-1">
                                    {param.key === "male"
                                      ? "Добавить мужскую и женскую модели"
                                      : param.key === "proxyModelName"
                                        ? "Название прокси и слоты инвентаря"
                                        : param.description}
                                  </span>
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
            </CardHeader>

            <CardContent>
              <TooltipProvider>
                {/* Empty state */}
                {CATALOG.every(
                  (c) =>
                    c.params.filter((p) => activeTab.enabledParams[p.key])
                      .length === 0,
                ) && (
                  <EmptyState message="Нет добавленных параметров. Нажмите «Добавить параметр», чтобы начать." />
                )}

                {/* Parameter groups */}
                <div className="flex flex-col gap-5">
                  {CATALOG.filter(
                    (c) =>
                      c.id !== "animEvents" &&
                      c.id !== "damageSystem" &&
                      c.id !== "clothingTypes",
                  ).map((category) => {
                    const enabledInCat = category.params.filter(
                      (p) => activeTab.enabledParams[p.key],
                    );
                    if (enabledInCat.length === 0) return null;

                    return (
                      <div key={category.id}>
                        {/* Category label */}
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2 pl-0.5">
                          {category.title}
                        </p>

                        <div className="flex flex-col gap-2">
                          {enabledInCat.map((param) => {
                            if (
                              param.key === "female" ||
                              param.key === "proxyInventorySlot"
                            )
                              return null;

                            const value =
                              activeTab.values[param.key] ?? param.defaultValue;

                            // Tied params (male/female, proxyModelName/proxyInventorySlot)
                            let tiedParam: typeof param | null = null;
                            let tiedValue: any = null;
                            if (param.key === "male") {
                              tiedParam =
                                category.params.find(
                                  (p) => p.key === "female",
                                ) ?? null;
                              tiedValue =
                                activeTab.values["female"] ??
                                tiedParam?.defaultValue;
                            } else if (param.key === "proxyModelName") {
                              tiedParam =
                                category.params.find(
                                  (p) => p.key === "proxyInventorySlot",
                                ) ?? null;
                              tiedValue =
                                activeTab.values["proxyInventorySlot"] ??
                                tiedParam?.defaultValue;
                            }

                            return (
                              <div
                                key={param.key}
                                className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-3.5"
                              >
                                {/* Param header */}
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-1.5">
                                    <Label className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                                      {param.key === "male"
                                        ? "Male & Female Models"
                                        : param.key === "proxyModelName"
                                          ? "Proxy Model & Slots"
                                          : param.label}
                                    </Label>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle className="w-3.5 h-3.5 cursor-help text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="right"
                                        className="max-w-65"
                                      >
                                        <p className="text-sm">
                                          {param.description}
                                        </p>
                                        {param.example && (
                                          <p className="text-xs text-zinc-400 mt-1">
                                            <span className="font-medium">
                                              Example:
                                            </span>{" "}
                                            {param.example}
                                          </p>
                                        )}
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 -mr-1"
                                    onClick={() =>
                                      handleToggle(param.key, false)
                                    }
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </Button>
                                </div>

                                {/* Param input */}
                                {param.type === "string" && (
                                  <Input
                                    value={value}
                                    onChange={(e) =>
                                      handleValueChange(
                                        param.key,
                                        e.target.value,
                                      )
                                    }
                                    className="h-8 text-sm font-mono"
                                  />
                                )}

                                {param.type === "number" && (
                                  <Input
                                    type="number"
                                    value={value}
                                    min={param.key === "scope" ? 0 : undefined}
                                    max={param.key === "scope" ? 2 : undefined}
                                    onChange={(e) => {
                                      let val = Number(e.target.value);
                                      if (param.key === "scope")
                                        val = Math.max(
                                          0,
                                          Math.min(2, Math.floor(val)),
                                        );
                                      handleValueChange(param.key, val);
                                    }}
                                    className="h-8 text-sm font-mono"
                                  />
                                )}

                                {param.type === "boolean" && (
                                  <div className="h-9 px-3 rounded-md border border-input bg-transparent flex items-center justify-between">
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                      {Number(value) === 1 || value === true ? "1" : "0"}
                                    </span>
                                    <Switch
                                      checked={Number(value) === 1 || value === true}
                                      onCheckedChange={(checked) =>
                                        handleValueChange(param.key, checked ? 1 : 0)
                                      }
                                    />
                                  </div>
                                )}

                                {param.type === "armor_modifier" && (
                                  <div className="flex items-center gap-2">
                                    {["Health", "Blood", "Shock"].map(
                                      (dmgType) => (
                                        <div
                                          key={dmgType}
                                          className="flex-1 flex flex-col gap-1"
                                        >
                                          <Label className="text-[10px] text-zinc-500">
                                            {dmgType}
                                          </Label>
                                          <Input
                                            type="number"
                                            value={
                                              value?.[dmgType] !== undefined
                                                ? value[dmgType]
                                                : 1.0
                                            }
                                            min={0}
                                            max={1}
                                            step={0.05}
                                            onChange={(e) => {
                                              const val = Math.max(
                                                0,
                                                Math.min(
                                                  1,
                                                  Number(e.target.value),
                                                ),
                                              );
                                              handleValueChange(param.key, {
                                                ...(value || {
                                                  Health: 1.0,
                                                  Blood: 1.0,
                                                  Shock: 1.0,
                                                }),
                                                [dmgType]: val,
                                              });
                                            }}
                                            className="h-8 text-sm font-mono"
                                          />
                                        </div>
                                      ),
                                    )}
                                  </div>
                                )}

                                {param.type === "select" && (
                                  <Select
                                    value={value !== undefined ? String(value) : (param.defaultValue !== undefined ? String(param.defaultValue) : "")}
                                    onValueChange={(val) => {
                                      const numericVal = Number(val);
                                      handleValueChange(param.key, isNaN(numericVal) ? val : numericVal);
                                    }}
                                  >
                                    <SelectTrigger className="h-8 text-sm">
                                      <SelectValue placeholder="Выберите значение..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {param.selectOptions?.map((opt) => (
                                        <SelectItem
                                          key={String(opt.value)}
                                          value={String(opt.value)}
                                        >
                                          {opt.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}

                                {param.type === "multi-select" && (
                                  <MultiSelect
                                    options={(param.selectOptions as any) || []}
                                    onChange={(vals: string[]) =>
                                      handleValueChange(param.key, vals)
                                    }
                                    value={value || []}
                                    placeholder="Выберите значения..."
                                  />
                                )}

                                {param.type === "combobox" && (
                                  <ComboBox
                                    options={
                                      (param.selectOptions || []).map((opt) => ({
                                        label: opt.label,
                                        value: String(opt.value),
                                      }))
                                    }
                                    onChange={(val: string) =>
                                      handleValueChange(param.key, val)
                                    }
                                    value={
                                      Array.isArray(value)
                                        ? String(value[0] || "")
                                        : String(value ?? "")
                                    }
                                    placeholder="Выберите значение..."
                                    allowCustom={param.key === "inventorySlot"}
                                    searchPlaceholder={
                                      param.key === "inventorySlot"
                                        ? "Выберите или введите свой слот..."
                                        : "Search..."
                                    }
                                    customOptionLabel={
                                      param.key === "inventorySlot"
                                        ? (customValue) => `Использовать свой слот: ${customValue}`
                                        : undefined
                                    }
                                  />
                                )}

                                {param.type === "anim_event" && (
                                  <Select
                                    value={
                                      value?.soundSet ||
                                      param.defaultValue?.soundSet ||
                                      ""
                                    }
                                    onValueChange={(newSoundSet) => {
                                      const opt = param.options?.find(
                                        (o) => o.soundSet === newSoundSet,
                                      );
                                      if (opt)
                                        handleValueChange(param.key, {
                                          soundSet: opt.soundSet,
                                          id: opt.id,
                                        });
                                    }}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Выберите звук..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {param.options?.map((opt) => (
                                        <SelectItem
                                          key={opt.soundSet}
                                          value={opt.soundSet}
                                        >
                                          {opt.label} ({opt.soundSet})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}

                                {param.type === "array_of_strings" && (
                                  <div className="flex flex-col gap-2">
                                    {(value || []).map(
                                      (item: string, idx: number) => (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-1"
                                        >
                                          <Input
                                            value={item}
                                            onChange={(e) =>
                                              handleArrayItemChange(
                                                param.key,
                                                idx,
                                                e.target.value,
                                              )
                                            }
                                            placeholder="Значение..."
                                            className="h-8 text-sm font-mono flex-1"
                                          />
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-zinc-400 hover:text-red-500"
                                            onClick={() =>
                                              handleRemoveArrayItem(
                                                param.key,
                                                idx,
                                              )
                                            }
                                          >
                                            <X className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      ),
                                    )}
                                    {(!value || value.length === 0) && (
                                      <p className="text-[10px] text-zinc-400 italic">
                                        Список пуст
                                      </p>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-7 text-xs self-start"
                                      onClick={() =>
                                        handleAddArrayItem(param.key)
                                      }
                                    >
                                      <Plus className="w-3 h-3 mr-1" /> Добавить
                                      элемент
                                    </Button>
                                  </div>
                                )}

                                {param.type === "array_of_numbers" && (
                                  <Input
                                    value={getArrayValueStr(value)}
                                    onChange={(e) =>
                                      handleValueChange(
                                        param.key,
                                        parseArrayInput(
                                          param.type,
                                          e.target.value,
                                        ),
                                      )
                                    }
                                    placeholder="Comma separated values"
                                    className="h-8 text-sm font-mono"
                                  />
                                )}

                                {/* Tied param (female / proxyInventorySlot) */}
                                {tiedParam && (
                                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <Label className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                                        {tiedParam.label}
                                      </Label>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle className="w-3.5 h-3.5 cursor-help text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
                                        </TooltipTrigger>
                                        <TooltipContent
                                          side="right"
                                          className="max-w-65"
                                        >
                                          <p className="text-sm">
                                            {tiedParam.description}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>

                                    {tiedParam.type === "string" && (
                                      <Input
                                        value={tiedValue}
                                        onChange={(e) =>
                                          handleValueChange(
                                            tiedParam!.key,
                                            e.target.value,
                                          )
                                        }
                                        className="h-8 text-sm font-mono"
                                      />
                                    )}

                                    {tiedParam.type === "array_of_strings" && (
                                      <div className="flex flex-col gap-2">
                                        {(tiedValue || []).map(
                                          (item: string, idx: number) => (
                                            <div
                                              key={idx}
                                              className="flex items-center gap-1"
                                            >
                                              <Input
                                                value={item}
                                                onChange={(e) =>
                                                  handleArrayItemChange(
                                                    tiedParam!.key,
                                                    idx,
                                                    e.target.value,
                                                  )
                                                }
                                                placeholder="Значение..."
                                                className="h-8 text-sm font-mono flex-1"
                                              />
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-zinc-400 hover:text-red-500"
                                                onClick={() =>
                                                  handleRemoveArrayItem(
                                                    tiedParam!.key,
                                                    idx,
                                                  )
                                                }
                                              >
                                                <X className="w-4 h-4" />
                                              </Button>
                                            </div>
                                          ),
                                        )}
                                        {(!tiedValue ||
                                          tiedValue.length === 0) && (
                                          <p className="text-[10px] text-zinc-400 italic">
                                            Список пуст
                                          </p>
                                        )}
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-7 text-xs self-start"
                                          onClick={() =>
                                            handleAddArrayItem(tiedParam!.key)
                                          }
                                        >
                                          <Plus className="w-3 h-3 mr-1" />{" "}
                                          Добавить элемент
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>

          {/* ════════════════════════════════════
              BLOCKS 4-9 — SUB-SECTIONS
          ════════════════════════════════════ */}
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
        </div>
      </ScrollArea>
    </div>
  );
}
