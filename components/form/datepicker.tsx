"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldErrors } from "react-hook-form";
import { DefaultFormData } from "./form";
import { renderError } from "./utils";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@hookform/error-message";

interface DatePickerProps {
  label?: string;  
  name: string;
  errors: FieldErrors<DefaultFormData>;
  onChange?: any;
  value: Date;
}

export function DatePicker(props: DatePickerProps) {
  const { label, name, errors, value: date, onChange } = props;
  //const [date, setDate] = React.useState<Date>();

  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="pt-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal w-full",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onChange}
              //initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <ErrorMessage errors={errors} name={name} render={renderError} />
    </div>
  );
}
