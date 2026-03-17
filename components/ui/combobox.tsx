"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
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

interface ComboBoxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  allowCustom?: boolean;
  searchPlaceholder?: string;
  customOptionLabel?: (value: string) => string;
}

export function ComboBox({
  options,
  value,
  onChange,
  placeholder = "Select item...",
  className,
  allowCustom = false,
  searchPlaceholder = "Search...",
  customOptionLabel,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const selected = options.find((option) => option.value === value);
  const trimmedSearch = search.trim();
  const hasExactMatch = options.some(
    (option) => option.value === trimmedSearch || option.label === trimmedSearch,
  );
  const showCustomOption = allowCustom && trimmedSearch.length > 0 && !hasExactMatch;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearch("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {selected?.label || value || placeholder}
          </span>
          <span className="flex items-center gap-1.5">
            {value ? (
              <span
                role="button"
                tabIndex={0}
                className="rounded-sm p-0.5 hover:bg-muted"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange("");
                  }
                }}
              >
                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              </span>
            ) : null}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command className="w-full">
          <CommandInput
            placeholder={searchPlaceholder}
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {showCustomOption && (
                <CommandItem
                  value={trimmedSearch}
                  onSelect={() => {
                    onChange(trimmedSearch);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Check className="mr-2 h-4 w-4 opacity-0" />
                  <span>
                    {customOptionLabel
                      ? customOptionLabel(trimmedSearch)
                      : `Use \"${trimmedSearch}\"`}
                  </span>
                </CommandItem>
              )}
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
