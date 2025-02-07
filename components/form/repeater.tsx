"use client";

import { ErrorMessage } from "@hookform/error-message";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Form, { DefaultFormData } from "./form";
import {
  FieldErrors,
  RegisterOptions,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form";
import { renderError } from "./utils";
import { ChangeEvent, ChangeEventHandler, ReactElement, useState } from "react";
import { FormField } from "@/resources/resources.types";
import { Button } from "../ui/button";

export type RepeaterRenderFunc = (props: RepeaterRenderProps) => ReactElement;

interface RepeaterProps {
  label?: string;
  type: string;
  name: string;
  value: any;
  className?: string;
  placeholder?: string;
  fields: FormField[];
  onChange?: ChangeEventHandler<HTMLInputElement>;
  errors: FieldErrors<DefaultFormData>;
  renderField: any;
  unregister: any;
  render?: RepeaterRenderFunc;
  control: any;
}

interface RepeaterRenderProps {
  label?: string;
  name: string;
  fields: FormField[][];
  errors: FieldErrors<DefaultFormData>;
  addField: any;
  removeField: any;
  renderField: any;
}

export default function RepeaterInput(props: RepeaterProps) {
  const { label, name, onChange, fields, renderField, render, control } = props;

  const {
    fields: arrayFields,
    append,
    prepend,
    remove,
    swap,
    move,
    insert,
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name,
  });

  const defaultValue = fields.reduce((acc, current) => {
    acc[current.name] = "";
    return acc;
  }, {} as Record<string, string>);

  if (fields.length === 0) {
    append(defaultValue);
  }

  const registerOptions: RegisterOptions = {};
  if (onChange) {
    registerOptions["onChange"] = (e: ChangeEvent<HTMLInputElement>) =>
      onChange(e);
  }

  if (render) {
    //return render({ fields: formFields, name, label, errors, append, remove });
  }

  return (
    <>
      <label>{label}</label>
      <div className="flex flex-col ga-3">
        {arrayFields.map((item: any, index) => {
          return (
            <div key={item.id}>
              <div>
                {fields.map((f) => (
                  <div key={f.name}>
                    {renderField({
                      ...f,
                      name: name + "." + index + "." + f.name,
                    })}
                  </div>
                ))}
              </div>
              <Button type="button" onClick={() => remove(index)}>
                Remove field
              </Button>
            </div>
          );
        })}
        <Button type="button" onClick={() => append(defaultValue)}>
          Add field
        </Button>
      </div>
    </>
  );
}
