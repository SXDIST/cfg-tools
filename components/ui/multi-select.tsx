"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { useLocale } from "@/components/locale-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  allowCustom?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
  className,
  allowCustom = false,
}: MultiSelectProps) {
  const { t } = useLocale();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const handleUnselect = (item: string) => {
    onChange(value.filter((i) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-auto min-h-9 w-full justify-between px-3 py-2 font-normal hover:bg-background",
            className,
          )}
        >
          <div className="flex flex-wrap gap-1">
            {value.length > 0 ? (
              value.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnselect(item);
                  }}
                >
                  {options.find((o) => o.value === item)?.label || item}
                  <span
                    role="button"
                    tabIndex={0}
                    className="ml-1 cursor-pointer rounded-full ring-offset-background outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnselect(item);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </span>
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                {placeholder || t("choose_values")}
              </span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command className="w-full">
          <CommandInput
            placeholder={t("search")}
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {allowCustom && search.trim() ? (
                <button
                  className="w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-accent"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    const trimmed = search.trim();
                    if (trimmed && !value.includes(trimmed)) {
                      onChange([...value, trimmed]);
                    }
                    setSearch("");
                  }}
                >
                  {t("add")}:{" "}
                  <span className="font-medium">{search.trim()}</span>
                </button>
              ) : (
                t("no_query_results")
              )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange(
                        isSelected
                          ? value.filter((i) => i !== option.value)
                          : [...value, option.value],
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
              {allowCustom &&
                search.trim() &&
                !options.some((option) => option.value === search.trim()) && (
                  <CommandItem
                    key="__custom__"
                    value={search.trim()}
                    onSelect={() => {
                      const trimmed = search.trim();
                      if (trimmed && !value.includes(trimmed)) {
                        onChange([...value, trimmed]);
                      }
                      setSearch("");
                    }}
                  >
                    <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary opacity-50 [&_svg]:invisible">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>
                      {t("add")}:{" "}
                      <span className="font-medium">{search.trim()}</span>
                    </span>
                  </CommandItem>
                )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
