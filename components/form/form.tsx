"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSX } from "react";
import { FormField, MultiSelectOption } from "@/resources/resources.types";
import { FormSchema } from "@/validation";
import rules from "@/validation";
import FormInput from "@/components/form/input";
import FormSelect from "@/components/form/select";
//import FormMultiSelect from '@/components/form/multi-select';
import { MultiSelect } from "@/components/form/multi-select";
import FormCheckbox from "@/components/form/checkbox";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DatePicker } from "./datepicker";
import { Button } from "../ui/button";

export interface DefaultFormData {
  [key: string]: any;
}

export interface FormValues {
  email: string;
  name: string;
}

export interface FormState {
  isValid: boolean;
  pending: boolean;
}

export type actionResult = {
  redirect?: string;
  message?: string;
  error?: { path: string; message: string };
};

export type FormRender = (props: {
  fields: Record<string, JSX.Element>;
  formState: FormState;
}) => JSX.Element;

interface FormProps {
  fields: FormField[];
  validation: FormSchema;
  data?: DefaultFormData;
  action: (...args: any[]) => any;
  buttons?: ((props: FormState) => JSX.Element)[];
  render?: FormRender;
}

export default function Form({
  fields,
  validation,
  data,
  action,
  buttons,
  render,
}: FormProps) {
  const { replace } = useRouter();
  const validationRules = rules[validation];

  const {
    register,
    formState: { isValid, errors, isLoading },
    setError,
    control,
    handleSubmit,
    getValues,
  } = useForm({
    //mode: "onSubmit",
    resolver: zodResolver(validationRules),
    defaultValues: data,
  });
  /*console.log(getValues());
  console.log(errors);*/

  const submitForm = async (formData: unknown) => {
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

  const renderField = (field: FormField) => (
    <>
      {["text", "number", "email", "hidden"].includes(field.type) && (
        <>
          <FormInput
            label={field.label}
            name={field.name}
            errors={errors}
            type={field.type}
            register={register}
            onChange={field.onChange}
          />
        </>
      )}

      {field.type === "checkbox" && (
        <>
          <Controller
            control={control}
            name={field.name}
            render={({ field: { onChange, value, name } }) => (
              <FormCheckbox
                label={field.label}
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

      {field.type === "datepicker" && (
        <>
          <Controller
            control={control}
            name={field.name}
            render={({ field: { onChange, value, name } }) => (
              <DatePicker
                label={field.label}
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

      {["select", "fk"].includes(field.type) && (
        <Controller
          control={control}
          name={field.name}
          render={({ field: { onChange, value, name } }) => (
            <FormSelect
              label={field.label}
              name={name}
              errors={errors}
              value={value}
              className={field.className}
              onChange={(value) => {
                onChange(value);
                if (field.onChange) {
                  field.onChange(value);
                }
              }}
              options={field.options!}
            />
          )}
        />
      )}

      {["m2m"].includes(field.type) && (
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
                options={field.options! as MultiSelectOption[]}
                onValueChange={(v) => {
                  onChange(v);
                }}
                defaultValue={selectValue}
                placeholder="Select frameworks"
                variant="inverted"
                animation={2}
                maxCount={3}
              />
            );
          }}
        />
      )}
    </>
  );

  const fieldsToRender = fields.reduce((acc, field) => {
    acc[field.name] = renderField(field);
    return acc;
  }, {} as Record<string, JSX.Element>);

  if (render) {
    const renderContent = render({
      fields: fieldsToRender,
      formState: { isValid, pending: isLoading },
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
              <Button key={index} isValid={isValid} pending={isLoading} />
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
