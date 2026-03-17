"use client";

import { memo } from "react";
import { Plus, Trash, X } from "lucide-react";
import {
  useAppStore,
  ChildClassData,
  SlotData,
  ProxyData,
  CustomParamData,
  CustomParamType,
} from "@/lib/store";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { ComboBox } from "./ui/combobox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";

export function EmptyState({ message }: { message: string }) {
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

export const SCOPE_OPTIONS = [
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
    .map((item) => (type === "array_of_numbers" ? Number(item) : item))
    .filter((item) =>
      type === "array_of_numbers" ? !Number.isNaN(item as number) : true,
    );
}

export const CustomParamsSection = memo(function CustomParamsSection({
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
            <span className="font-semibold text-sm">Пользовательские параметры</span>
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

export const SlotsSection = memo(function SlotsSection({
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

export const ProxiesSection = memo(function ProxiesSection({
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

export const RetexturesSection = memo(function RetexturesSection({
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
