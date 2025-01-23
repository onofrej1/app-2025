"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { FieldErrors } from "react-hook-form";
import { DefaultFormData } from "./form";
import { MultiSelectOption, SelectOption } from "@/resources/resources.types";
import { Label } from "../ui/label";

interface MultiSelectProps {
  label?: string;
  name: string;
  errors: FieldErrors<DefaultFormData>;
  options: MultiSelectOption[];
  value: string[]; // | number[],
  textField: string;
  onChange: (value: string[]) => void;
  //ref: any,
}

export function MultiSelect(props: MultiSelectProps) {
  const {
    label,
    options,
    value,
    onChange,
    //name,
    //errors,
    //textField,
    //ref
  } = props;
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    onChange(value);
  }, []);

  const handleSetValue = (val: string) => {
    if (value.includes(val)) {
      value.splice(value.indexOf(val), 1);
      const newValue = value.filter((item) => item !== val);
      onChange(newValue);
    } else {
      const newValue = [...value, val];
      onChange(newValue);
    }
  };

  return (
    <>
      {label && <Label>{label}</Label>}
      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[480px] justify-between"
            >
              <div className="flex gap-2 justify-start">
                {value?.length
                  ? value.map((val, i) => (
                      <div
                        key={val}
                        className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium"
                      >
                        {options.find((option) => option.value === val)?.label}
                      </div>
                    ))
                  : "Select framework..."}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[480px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." />
              <CommandEmpty>No data found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        handleSetValue(option.value);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
