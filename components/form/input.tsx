"use client";

import { ErrorMessage } from "@hookform/error-message";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DefaultFormData } from "./form";
import { FieldErrors, RegisterOptions, UseFormRegister } from "react-hook-form";
import { renderError } from "./utils";
import { ChangeEvent, ChangeEventHandler } from "react";

interface InputProps {
  label?: string;
  type: string;
  name: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  errors: FieldErrors<DefaultFormData>;
  register: UseFormRegister<DefaultFormData>;
}

export default function FormInput(props: InputProps) {
  const { label, name, type, placeholder, onChange, errors, register } =
    props;
  if (type === "hidden") {
    return <Input type="hidden" {...register(name)} placeholder={label} />;
  }

  const registerOptions: RegisterOptions = {};
  if (onChange) {
    registerOptions["onChange"] = (e: ChangeEvent<HTMLInputElement>) => onChange(e);
  }

  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="pt-1">
        <Input
          key={name}
          type={type || "text"}
          {...register(name, registerOptions)}
          placeholder={placeholder || label}
        />
      </div>

      <ErrorMessage errors={errors} name={name} render={renderError} />
    </div>
  );
}
