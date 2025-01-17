"use client";

import { ErrorMessage } from "@hookform/error-message";
import { Label } from "../ui/label";
import { DefaultFormData } from "./form";
import { FieldErrors, RegisterOptions, UseFormRegister } from "react-hook-form";
import { renderError } from "./utils";
import { Textarea as TextareaInput } from "../ui/textarea";
import { ChangeEvent, ChangeEventHandler } from "react";

interface InputProps {
  label?: string;
  name: string;
  placeholder?: string;
  rows?: number;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  errors: FieldErrors<DefaultFormData>;
  register: UseFormRegister<DefaultFormData>;
}

export default function Textarea(props: InputProps) {
  const { label, name, rows, placeholder, onChange, errors, register } = props;

  const registerOptions: RegisterOptions = {};
  if (onChange) {
    registerOptions["onChange"] = (e: ChangeEvent<HTMLTextAreaElement>) =>
      onChange(e);
  }

  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="pt-1">
        <TextareaInput
          key={name}
          rows={rows || 3}
          {...register(name, registerOptions)}
          placeholder={placeholder}
        />
      </div>

      <ErrorMessage errors={errors} name={name} render={renderError} />
    </div>
  );
}
