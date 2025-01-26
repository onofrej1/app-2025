"use client";
import { Controller, FormState, useForm, UseFormGetValues, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSX } from "react";
import {
  FormField,
  MultiSelectOption,
  MultiSelectType,
  SelectType,
  TextAreaType,
} from "@/resources/resources.types";
import { FormSchema } from "@/validation";
import rules from "@/validation";
import FormInput from "@/components/form/input";
import FormSelect from "@/components/form/select";
import { MultiSelect } from "@/components/form/multi-select";
import FormCheckbox from "@/components/form/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DatePicker } from "./datepicker";
import { Button } from "../ui/button";
import Textarea from "./textarea";
import RichEditor from "./richeditor";
import { z } from "zod";

export interface DefaultFormData {
  [key: string]: any;
}

export type actionResult = {
  redirect?: string;
  message?: string;
  error?: { path: string; message: string };
};

export type FormRenderProps = {
  fields: Record<string, JSX.Element>;
  formState: FormState<DefaultFormData>;
  getValues: UseFormGetValues<DefaultFormData>;
  setValue: UseFormSetValue<DefaultFormData>;
  trigger: UseFormTrigger<DefaultFormData>;
};

export type FormRender = (props: FormRenderProps) => JSX.Element;

interface FormProps {
  fields: FormField[];
  validation?: FormSchema;
  data?: DefaultFormData;
  action?: (...args: any[]) => any;
  buttons?: ((props: Partial<FormState<DefaultFormData>>) => JSX.Element)[];
  render?: FormRender;
  children?: FormRender;
}

export default function Form({
  fields,
  validation,
  data,
  action,
  buttons,
  render,
  children,
}: FormProps) {
  const { replace } = useRouter();
  //@ts-ignore
  const validationRules = rules[validation] || z.any();

  const {
    register,
    formState,
    setError,
    control,
    trigger,
    setValue,
    handleSubmit,
    getValues,
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(validationRules),
    defaultValues: data,
  });
  const { isValid, errors, isLoading } = formState;
  console.log(getValues());
  console.log(errors);

  const submitForm = async (formData: unknown) => {
    if (!action) return;

    try {
      const data: actionResult = await action(formData);
      if (!data) {
        return;
      }
      if (data.message) {
        toast(data.message);
      }
      if (data.error) {
        setError(data.error.path, {
          message: data.error.message,
        });
      }
      if (data.redirect) {
        replace(data.redirect);
        return;
      }
    } catch (e) {
      console.log(e);
      return "An error occured";
    }
  };

  const renderField = (field: FormField) => {
    const type = field.type; // || "text";
    const label = field.label; // || capitalize(field.name);
    return (
      <>
        {["text", "number", "email", "hidden"].includes(type) && (
          <>
            <FormInput
              label={label}
              name={field.name}
              errors={errors}
              className={field.className}
              type={type}
              register={register}
              onChange={field.onChange}
            />
          </>
        )}

        {type === "textarea" && (
          <>
            <Textarea
              label={label}
              name={field.name}
              errors={errors}
              rows={(field as TextAreaType).rows}
              register={register}
              onChange={field.onChange}
            />
          </>
        )}

        {type === "checkbox" && (
          <>
            <Controller
              control={control}
              name={field.name}
              render={({ field: { onChange, value, name } }) => (
                <FormCheckbox
                  label={label || name}
                  name={name}
                  errors={errors}
                  checked={!!value}
                  onChange={(value) => {
                    onChange(value);
                    if (field.onChange) {
                      field.onChange(value);
                    }
                  }}
                />
              )}
            />
          </>
        )}

        {type === "datepicker" && (
          <>
            <Controller
              control={control}
              name={field.name}
              render={({ field: { onChange, value, name } }) => (
                <DatePicker
                  label={label}
                  name={name}
                  value={value}
                  errors={errors}
                  onChange={(value: Date | undefined) => {
                    console.log(value);
                    onChange(value);
                    if (field.onChange) {
                      field.onChange(value);
                    }
                  }}
                />
              )}
            />
          </>
        )}

        {["select", "fk"].includes(type) && (
          <Controller
            control={control}
            name={field.name}
            render={({ field: { onChange, value, name } }) => (
              <FormSelect
                label={label}
                name={name}
                errors={errors}
                value={value}
                setValue={setValue}
                className={field.className}
                onChange={(value) => {
                  onChange(value);
                  if (field.onChange) {
                    field.onChange(value);
                  }
                }}
                options={(field as SelectType).options!}
              />
            )}
          />
        )}

        {["m2m"].includes(type) && (
          <Controller
            control={control}
            name={field.name}
            render={({ field: { onChange, value, name } }) => {
              const selectValue =
                value && value.length > 0
                  ? value.map((v: any) => (v.id ? v.id : v))
                  : [];
              return (
                <MultiSelect
                  name={name}
                  label={label}
                  errors={errors}
                  textField=""
                  options={
                    (field as MultiSelectType).options! as MultiSelectOption[]
                  }
                  onChange={(v) => {
                    onChange(v);
                  }}
                  value={selectValue}
                  //placeholder={field.placeholder}
                />
              );
            }}
          />
        )}

        {["richtext"].includes(type) && (
          <Controller
            control={control}
            name={field.name}
            render={({ field: { onChange, value, name } }) => (
              <RichEditor name={name} onChange={onChange} value={value} label={label} />
            )}
          />
        )}
      </>
    );
  };

  const fieldsToRender = fields.reduce((acc, field) => {
    acc[field.name] = renderField(field);
    return acc;
  }, {} as Record<string, JSX.Element>);

  if (children) {
    return (
      <form onSubmit={handleSubmit(submitForm)}>
        {children({
          fields: fieldsToRender,
          formState,
          setValue,
          getValues,
          trigger,
        })}
      </form>
    );
  }

  if (render) {
    const renderContent = render({
      fields: fieldsToRender,
      formState,
      setValue,
      getValues,
      trigger,
    });
    return (
      <>
        <form onSubmit={handleSubmit(submitForm)}>{renderContent}</form>
      </>
    );
  }

  const fieldNames = fields.map((f) => f.name);
  const restMessages = Object.keys(errors).filter(
    (e) => !fieldNames.includes(e)
  );

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        {fields.map((field) => (
          <div className="mb-3" key={field.name}>
            {renderField(field)}
          </div>
        ))}

        {restMessages.map((e) => (
          <div className="my-4" key={e}>
            {errors[e]?.message?.toString()}
          </div>
        ))}

        {buttons?.length ? (
          <div className="flex space-x-2">
            {buttons.map((Button, index) => (
              <Button key={index} isValid={isValid} isLoading={isLoading} />
            ))}
          </div>
        ) : (
          <Button type="submit" className="mt-3">
            Submit
          </Button>
        )}
      </form>
    </>
  );
}
