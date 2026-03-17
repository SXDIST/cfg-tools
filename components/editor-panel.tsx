"use client";

import { useState, memo } from "react";
import {
  useAppStore,
  ChildClassData,
  SlotData,
  ProxyData,
  CustomParamData,
  CustomParamType,
} from "@/lib/store";
import { CATALOG } from "@/lib/catalog";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader } from "./ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { HelpCircle, ChevronDown, Plus, Trash, X, Copy, GripVertical } from "lucide-react";
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
import { MultiSelect, type Option as MultiSelectOption } from "./ui/multi-select";
import { ComboBox } from "./ui/combobox";

// ─────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center text-xs text-zinc-400 dark:text-zinc-500 py-7 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg">
      {message}
    </div>
  );
}

const CUSTOM_PARAM_TYPE_OPTIONS: {
  value: CustomParamType;
  label: string;
}[] = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "array_of_strings", label: "String[]" },
  { value: "array_of_numbers", label: "Number[]" },
];

const SCOPE_OPTIONS = [
  { value: "0", label: "0 - Base Class" },
  { value: "1", label: "1 - Hidden" },
  { value: "2", label: "2 - Public" },
];

function getDefaultCustomParamValue(type: CustomParamType) {
  switch (type) {
    case "number":
      return 0;
    case "boolean":
      return false;
    case "array_of_strings":
    case "array_of_numbers":
      return [];
    case "string":
    default:
      return "";
  }
}

function parseCustomArrayValue(type: CustomParamType, value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) =>
      type === "array_of_numbers" ? Number(item) : item,
    )
    .filter((item) =>
      type === "array_of_numbers" ? !Number.isNaN(item as number) : true,
    );
}

const CustomParamsSection = memo(function CustomParamsSection({
  customParams,
  configId,
  tabId,
}: {
  customParams: CustomParamData[];
  configId: string;
  tabId: string;
}) {
  const addCustomParam = useAppStore((s) => s.addCustomParam);
  const updateCustomParam = useAppStore((s) => s.updateCustomParam);
  const deleteCustomParam = useAppStore((s) => s.deleteCustomParam);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg"
    >
      <AccordionItem value="custom-params" className="border-b-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-lg transition-colors">
          <div className="flex flex-col items-start gap-1">
            <span className="font-semibold text-sm">
              Пользовательские параметры
            </span>
            <span className="text-xs text-zinc-500 font-normal">
              Любые свои поля, которых нет в стандартном каталоге.
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-0 pb-4 px-4">
          <div className="flex justify-end mb-3">
            <Button
              variant="outline"
              size="sm"
              className="h-8 shrink-0"
              onClick={() => addCustomParam(configId, tabId)}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Добавить параметр
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {customParams.length === 0 && (
              <EmptyState message="Нет пользовательских параметров. Нажмите «Добавить параметр»." />
            )}
            {customParams.map((param) => {
              const arrayValue = Array.isArray(param.value)
                ? param.value.join(", ")
                : "";

              return (
                <div
                  key={param.id}
                  className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 flex flex-col gap-3"
                >
                  <div className="flex gap-3 items-start">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                      <div>
                        <Label className="text-xs text-zinc-500 mb-1 block">
                          Имя параметра
                        </Label>
                        <Input
                          value={param.key}
                          onChange={(e) =>
                            updateCustomParam(configId, tabId, param.id, {
                              key: e.target.value,
                            })
                          }
                          className="h-8 text-sm font-mono"
                          placeholder="isMeleeWeapon"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-zinc-500 mb-1 block">
                          Placement
                        </Label>
                        <Input
                          value={param.placement}
                          onChange={(e) =>
                            updateCustomParam(configId, tabId, param.id, {
                              placement: e.target.value || "root",
                            })
                          }
                          className="h-8 text-sm font-mono"
                          placeholder="root / DamageSystem / ClothingTypes"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-zinc-500 mb-1 block">
                          Тип
                        </Label>
                        <Select
                          value={param.type}
                          onValueChange={(value) =>
                            updateCustomParam(configId, tabId, param.id, {
                              type: value as CustomParamType,
                              value: getDefaultCustomParamValue(
                                value as CustomParamType,
                              ),
                            })
                          }
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CUSTOM_PARAM_TYPE_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-400 hover:text-red-500 shrink-0 mt-5"
                      onClick={() =>
                        deleteCustomParam(configId, tabId, param.id)
                      }
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>

                  <div>
                    <Label className="text-xs text-zinc-500 mb-1 block">
                      Значение
                    </Label>

                    {param.type === "string" && (
                      <Input
                        value={String(param.value ?? "")}
                        onChange={(e) =>
                          updateCustomParam(configId, tabId, param.id, {
                            value: e.target.value,
                          })
                        }
                        className="h-8 text-sm font-mono"
                        placeholder="custom_value"
                      />
                    )}

                    {param.type === "number" && (
                      <Input
                        type="number"
                        value={Number(param.value ?? 0)}
                        onChange={(e) =>
                          updateCustomParam(configId, tabId, param.id, {
                            value: Number(e.target.value),
                          })
                        }
                        className="h-8 text-sm font-mono"
                      />
                    )}

                    {param.type === "boolean" && (
                      <div className="h-8 px-3 rounded-md border border-input bg-background flex items-center justify-between">
                        <span className="text-sm text-zinc-600 dark:text-zinc-300">
                          {param.value ? "true / 1" : "false / 0"}
                        </span>
                        <Switch
                          checked={Boolean(param.value)}
                          onCheckedChange={(checked) =>
                            updateCustomParam(configId, tabId, param.id, {
                              value: checked,
                            })
                          }
                        />
                      </div>
                    )}

                    {(param.type === "array_of_strings" ||
                      param.type === "array_of_numbers") && (
                      <Input
                        value={arrayValue}
                        onChange={(e) =>
                          updateCustomParam(configId, tabId, param.id, {
                            value: parseCustomArrayValue(
                              param.type,
                              e.target.value,
                            ),
                          })
                        }
                        className="h-8 text-sm font-mono"
                        placeholder="value1, value2"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
});

// ─────────────────────────────────────────────
// SLOTS SECTION
// ─────────────────────────────────────────────

const SlotsSection = memo(function SlotsSection({
  slots,
  configId,
}: {
  slots: SlotData[];
  configId: string;
}) {
  const addSlot = useAppStore((s) => s.addSlot);
  const updateSlot = useAppStore((s) => s.updateSlot);
  const deleteSlot = useAppStore((s) => s.deleteSlot);

  return (
    <Accordion type="single" collapsible className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <AccordionItem value="slots" className="border-b-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-lg transition-colors">
          <div className="flex flex-col items-start gap-1">
            <span className="font-semibold text-sm">Слоты (CfgSlots)</span>
            <span className="text-xs text-zinc-500 font-normal">
              Определение слотов для прикрепления предметов.
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-0 pb-4 px-4">
          <div className="flex justify-end mb-3">
            <Button
              variant="outline"
              size="sm"
              className="h-8 shrink-0"
              onClick={() => addSlot(configId)}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Добавить
            </Button>
          </div>
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
                        updateSlot(configId, slot.id, {
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
                  onClick={() => deleteSlot(configId, slot.id)}
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
                    updateSlot(configId, slot.id, {
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
                      updateSlot(configId, slot.id, {
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
                      updateSlot(configId, slot.id, {
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
});

// ─────────────────────────────────────────────
// PROXIES SECTION
// ─────────────────────────────────────────────

const ProxiesSection = memo(function ProxiesSection({
  proxies,
  configId,
}: {
  proxies: ProxyData[];
  configId: string;
}) {
  const addProxy = useAppStore((s) => s.addProxy);
  const updateProxy = useAppStore((s) => s.updateProxy);
  const deleteProxy = useAppStore((s) => s.deleteProxy);

  return (
    <Accordion type="single" collapsible className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <AccordionItem value="proxies" className="border-b-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-lg transition-colors">
          <div className="flex flex-col items-start gap-1">
            <span className="font-semibold text-sm">Прокси объекты (CfgNonAIVehicles)</span>
            <span className="text-xs text-zinc-500 font-normal">
              Объявление прикрепляемых частей (ProxyAttachment).
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-0 pb-4 px-4">
          <div className="flex justify-end mb-3">
            <Button
              variant="outline"
              size="sm"
              className="h-8 shrink-0"
              onClick={() => addProxy(configId)}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Добавить
            </Button>
          </div>
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
                        updateProxy(configId, proxy.id, {
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
                  onClick={() => deleteProxy(configId, proxy.id)}
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
                      updateProxy(configId, proxy.id, {
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
                          updateProxy(configId, proxy.id, {
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
                          updateProxy(configId, proxy.id, {
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
});

// ─────────────────────────────────────────────
// RETEXTURES SECTION
// ─────────────────────────────────────────────

const RetexturesSection = memo(function RetexturesSection({
  childClasses,
  configId,
  tabId,
  className,
}: {
  childClasses: ChildClassData[];
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
    const child = childClasses?.find((c) => c.id === childId);
    if (!child) return;
    const newArray = [...(child[field] || [])];
    newArray[index] = value;
    updateChildClass(configId, tabId, childId, { [field]: newArray });
  };

  const handleAddChildArrayItem = (
    childId: string,
    field: "hiddenSelectionsTextures" | "hiddenSelectionsMaterials",
  ) => {
    const child = childClasses?.find((c) => c.id === childId);
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
    const child = childClasses?.find((c) => c.id === childId);
    if (!child) return;
    const newArray = [...(child[field] || [])];
    newArray.splice(index, 1);
    updateChildClass(configId, tabId, childId, { [field]: newArray });
  };

  return (
    <Accordion type="single" collapsible className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <AccordionItem value="retextures" className="border-b-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-lg transition-colors">
          <div className="flex flex-col items-start gap-1">
            <span className="font-semibold text-sm">Варианты / Ретекстуры</span>
            <span className="text-xs text-zinc-500 font-normal">
              Дочерние классы, наследующие параметры этого класса.
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-0 pb-4 px-4">
          <div className="flex justify-end mb-3">
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
          <div className="flex flex-col gap-3">
          {(!childClasses || childClasses.length === 0) && (
            <EmptyState message="Нет ретекстур. Нажмите «Добавить»." />
          )}
          {childClasses?.map((child) => (
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
                  <ComboBox
                    options={SCOPE_OPTIONS}
                    value={String(child.scope ?? 2)}
                    onChange={(selectedValue) => {
                      const val = Math.max(
                        0,
                        Math.min(2, Number(selectedValue || "2")),
                      );
                      updateChildClass(configId, tabId, child.id, {
                        scope: val,
                      });
                    }}
                    className="h-8 text-sm"
                    searchPlaceholder="Выберите scope..."
                  />
                </div>
                <div className="w-28">
                  <Label className="text-[10px] uppercase text-zinc-500 mb-1 block">
                    Visibility Mod.
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    max={1}
                    value={child.visibilityModifier ?? 1.0}
                    onChange={(e) => {
                      const val = Math.max(0, Math.min(1, Number(e.target.value)));
                      updateChildClass(configId, tabId, child.id, {
                        visibilityModifier: val,
                      });
                    }}
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
});

// ─────────────────────────────────────────────
// ANIM EVENTS SECTION
// ─────────────────────────────────────────────

export function EditorPanel() {
  const [openDialog, setOpenDialog] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [searchParamQuery, setSearchParamQuery] = useState("");
  const [newAddonInput, setNewAddonInput] = useState("");
  const [dragTabIndex, setDragTabIndex] = useState<number | null>(null);
  const [dropTabIndex, setDropTabIndex] = useState<number | null>(null);

  const configs = useAppStore((s) => s.configs);
  const activeConfigId = useAppStore((s) => s.activeConfigId);
  const addConfig = useAppStore((s) => s.addConfig);
  const renameConfig = useAppStore((s) => s.renameConfig);
  const addTab = useAppStore((s) => s.addTab);
  const renameTab = useAppStore((s) => s.renameTab);
  const deleteTab = useAppStore((s) => s.deleteTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const duplicateTab = useAppStore((s) => s.duplicateTab);
  const moveTab = useAppStore((s) => s.moveTab);
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

  const handleValueChange = (key: string, value: unknown) => {
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

  const getArrayValueStr = (val: unknown) =>
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
              <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-1.5">
                {config.classes.map((cls, index) => (
                  <div
                    key={cls.id}
                    draggable={config.classes.length > 1}
                    className={`group relative flex items-center h-8 pl-2 pr-2.5 rounded-md text-xs font-medium border transition-all duration-150 shrink-0 max-w-45 cursor-grab active:cursor-grabbing ${
                      config.activeTabId === cls.id
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent shadow-md"
                        : "bg-white dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm hover:-translate-y-px"
                    }`}
                    style={{
                      opacity: dragTabIndex === index ? 0.55 : 1,
                      transform: dragTabIndex === index ? "scale(1.02)" : "scale(1)",
                      zIndex: dragTabIndex === index ? 10 : 1,
                    }}
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", cls.id);
                      setDragTabIndex(index);
                      setDropTabIndex(index);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      if (dropTabIndex !== index) {
                        setDropTabIndex(index);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragTabIndex !== null && dragTabIndex !== index) {
                        moveTab(config.id, dragTabIndex, index);
                      }
                      setDragTabIndex(null);
                      setDropTabIndex(null);
                    }}
                    onDragEnd={() => {
                      setDragTabIndex(null);
                      setDropTabIndex(null);
                    }}
                    onClick={() => setActiveTab(config.id, cls.id)}
                  >
                    {dropTabIndex === index && dragTabIndex !== index && (
                      <span className="absolute inset-0 rounded-md ring-2 ring-blue-400/70 dark:ring-blue-500/70 bg-blue-50/40 dark:bg-blue-500/10 pointer-events-none" />
                    )}
                    <GripVertical className="w-3.5 h-3.5 shrink-0 mr-1.5 opacity-35 group-hover:opacity-60 transition-opacity" />
                    <span className="truncate">
                      {cls.className || "NewClass"}
                    </span>
                    {config.classes.length > 1 && (
                      <button
                        type="button"
                        draggable={false}
                        className="ml-2 rounded-sm opacity-0 group-hover:opacity-70 hover:opacity-100! transition-all shrink-0"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                        onDragStart={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
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
                  className="h-8 w-8 shrink-0 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-dashed border-zinc-300/80 dark:border-zinc-700"
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
                {/* Accent "Add Parameter" button (Dialog) */}
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="h-8 gap-1.5 shrink-0 bg-zinc-900 hover:bg-zinc-700 text-white dark:bg-zinc-100 dark:hover:bg-zinc-300 dark:text-zinc-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Добавить параметр
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="!w-[calc(100vw-2rem)] !max-w-[calc(100vw-2rem)] sm:!w-[min(1500px,calc(100vw-2rem))] sm:!max-w-[min(1500px,calc(100vw-2rem))] p-0 overflow-hidden flex flex-col h-[min(90vh,920px)] bg-white dark:bg-zinc-950">
                    <DialogHeader className="p-4 pb-2 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                      <DialogTitle>Добавление параметра</DialogTitle>
                      <DialogDescription>
                        Выберите параметр для добавления в класс. Можно фильтровать по категориям или использовать поиск.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex min-h-0 flex-1 overflow-hidden">
                      {/* Sidebar / Categories */}
                      <div className="w-[280px] border-r border-zinc-200 dark:border-zinc-800 shrink-0 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/30">
                        <div className="p-3 font-semibold text-xs text-zinc-500 uppercase tracking-wider">Категории</div>
                        <ScrollArea className="min-h-0 flex-1">
                          <div className="px-2 pb-2 flex flex-col gap-1">
                            <button
                              className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                activeCategoryFilter === null
                                  ? "bg-zinc-200/50 dark:bg-zinc-800 font-medium"
                                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400"
                              }`}
                              onClick={() => setActiveCategoryFilter(null)}
                            >
                              Все параметры
                            </button>
                            {CATALOG.map((category) => (
                              <button
                                key={category.id}
                                className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                  activeCategoryFilter === category.id
                                    ? "bg-zinc-200/50 dark:bg-zinc-800 font-medium"
                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400"
                                }`}
                                onClick={() => setActiveCategoryFilter(category.id)}
                              >
                                {category.title}
                              </button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Main Main List */}
                      <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-zinc-950">
                        <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                           <Input
                             placeholder="Поиск параметра по имени или описанию..."
                             className="h-9"
                             value={searchParamQuery}
                             onChange={(e) => setSearchParamQuery(e.target.value)}
                           />
                        </div>
                        <ScrollArea className="min-h-0 flex-1">
                          <div className="p-3 flex flex-col gap-5">
                            {(() => {
                               const filteredCatalog = CATALOG.filter(
                                 (c) =>
                                   activeCategoryFilter === null || activeCategoryFilter === c.id
                               );
                               const sections = filteredCatalog.map((category) => {
                                  const unused = category.params.filter((p) => {
                                    if (p.key === "female" || p.key === "proxyInventorySlot") return false;
                                    if (activeTab.enabledParams[p.key]) return false;

                                    if (searchParamQuery.trim()) {
                                      const query = searchParamQuery.toLowerCase();
                                      const titleMatches = p.label.toLowerCase().includes(query);
                                      const descMatches = p.description.toLowerCase().includes(query);
                                      const keyMatches = p.key.toLowerCase().includes(query);
                                      if (!titleMatches && !descMatches && !keyMatches) {
                                        return false;
                                      }
                                    }
                                    return true;
                                  });

                                  return { category, unused };
                               });
                               const totalFound = sections.reduce(
                                 (sum, section) => sum + section.unused.length,
                                 0,
                               );

                               return (
                                 <>
                                   {sections.map(({ category, unused }) => {
                                      if (unused.length === 0) return null;

                                      return (
                                        <div key={category.id}>
                                          {activeCategoryFilter === null && (
                                            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                              {category.title}
                                            </div>
                                          )}
                                          <div className="grid gap-2">
                                            {unused.map((param) => (
                                              <div
                                                key={param.key}
                                                className="group border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all cursor-pointer flex items-center justify-between"
                                                onClick={() => {
                                                  handleToggle(param.key, true);
                                                  setOpenDialog(false);
                                                }}
                                              >
                                                <div>
                                                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-0.5">
                                                    {param.key === "male"
                                                      ? "Male & Female Models"
                                                      : param.key === "proxyModelName"
                                                        ? "Proxy Model & Slots"
                                                        : param.label}
                                                  </div>
                                                  <div className="text-xs text-zinc-500">
                                                    {param.key === "male"
                                                      ? "Добавить мужскую и женскую модели"
                                                      : param.key === "proxyModelName"
                                                        ? "Название прокси и слоты инвентаря"
                                                        : param.description}
                                                  </div>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 shrink-0 bg-white dark:bg-zinc-800 pointer-events-none">
                                                   <Plus className="w-4 h-4 text-blue-500" />
                                                </Button>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                   })}

                                   {totalFound === 0 && (
                                      <div className="py-10 text-center text-sm text-zinc-500">
                                        По вашему запросу ничего не найдено.
                                      </div>
                                   )}
                                 </>
                               )
                            })()}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
                  {CATALOG.map((category) => {
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
                            let tiedValue: unknown = null;
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

                            const tiedInputValue =
                              typeof tiedValue === "string" ||
                              typeof tiedValue === "number"
                                ? String(tiedValue)
                                : "";
                            const tiedArrayValue = Array.isArray(tiedValue)
                              ? tiedValue.map((item) => String(item))
                              : [];

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

                                {param.type === "number" &&
                                  param.key === "scope" && (
                                  <ComboBox
                                    options={SCOPE_OPTIONS}
                                    value={String(value ?? param.defaultValue ?? 2)}
                                    onChange={(selectedValue) => {
                                      const val = Math.max(
                                        0,
                                        Math.min(
                                          2,
                                          Math.floor(
                                            Number(selectedValue || "2"),
                                          ),
                                        ),
                                      );
                                      handleValueChange(param.key, val);
                                    }}
                                    className="h-8 text-sm"
                                    searchPlaceholder="Выберите scope..."
                                  />
                                )}

                                {param.type === "number" &&
                                  param.key !== "scope" && (
                                  <Input
                                    type="number"
                                    value={value}
                                    min={param.key === "visibilityModifier" ? 0 : undefined}
                                    max={param.key === "visibilityModifier" ? 1 : undefined}
                                    step={param.key === "visibilityModifier" ? 0.01 : undefined}
                                    onChange={(e) => {
                                      let val = Number(e.target.value);
                                      if (param.key === "visibilityModifier")
                                        val = Math.max(0, Math.min(1, val));
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
                                    options={
                                      (param.selectOptions || []) as MultiSelectOption[]
                                    }
                                    onChange={(vals: string[]) =>
                                      handleValueChange(param.key, vals)
                                    }
                                    value={Array.isArray(value) ? value : value ? [String(value)] : []}
                                    placeholder="Выберите значения..."
                                    allowCustom={param.key === "inventorySlot"}
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
                                        value={tiedInputValue}
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
                                        {tiedArrayValue.map(
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
                                        {tiedArrayValue.length === 0 && (
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
          
          <div className="flex flex-col gap-4">
          <CustomParamsSection
            customParams={activeTab.customParams || []}
            configId={config.id}
            tabId={activeTab.id}
          />

          {/* ════════════════════════════════════
              BLOCKS 4-9 — SUB-SECTIONS
          ════════════════════════════════════ */}
          <RetexturesSection
            childClasses={activeTab.children || []}
            configId={config.id}
            tabId={activeTab.id}
            className={activeTab.className}
          />
          <SlotsSection
            slots={config.slots || []}
            configId={config.id}
          />
          <ProxiesSection
            proxies={config.proxies || []}
            configId={config.id}
          />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

