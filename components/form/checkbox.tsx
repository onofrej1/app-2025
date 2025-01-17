"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FieldErrors } from "react-hook-form";
import { DefaultFormData } from "./form";
import { CheckedState } from "@radix-ui/react-checkbox";

interface CheckboxProps {
  label: string;
  name: string;
  errors: FieldErrors<DefaultFormData>;
  onChange: (checked: CheckedState) => void;
  checked: boolean;
}

export default function FormCheckbox({
  label,
  name,
  checked,
  onChange,
}: CheckboxProps) {
  return (
    <div className="flex items-center space-x-2 pt-2">
      <Checkbox id={name} checked={checked} onCheckedChange={onChange} />
      <label
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
}
