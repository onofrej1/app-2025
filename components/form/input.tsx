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
  className?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  errors: FieldErrors<DefaultFormData>;
  register: UseFormRegister<DefaultFormData>;
}

export default function FormInput(props: InputProps) {
  const {
    label,
    name,
    type,
    placeholder,
    onChange,
    className,
    errors,
    register,
  } = props;
  if (type === "hidden") {
    return <Input type="hidden" {...register(name)} placeholder={label} />;
  }

  const registerOptions: RegisterOptions = {};
  if (onChange) {
    registerOptions["onChange"] = (e: ChangeEvent<HTMLInputElement>) =>
      onChange(e);
  }

  const InputElement = (
    <Input
      className={className}
      key={name}
      type={type || "text"}
      {...register(name, registerOptions)}
      placeholder={placeholder || label}
    />
  );

  if (!label) {
    return InputElement;
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="pt-1">{InputElement}</div>
      <ErrorMessage errors={errors} name={name} render={renderError} />
    </div>
  );
}
