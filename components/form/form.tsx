"use client";
import {
  Controller,
  FormState,
  useForm,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSX, useEffect } from "react";
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
import FileUploader from "./fileUploader";
import { useUploadFields } from "@/hooks/useUploadFields";
import MediaUploader from "./mediaUploader";

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

  const defaultData = useUploadFields(fields, data);

  const {
    register,
    formState,
    setError,
    control,
    trigger,
    reset,
    setValue,
    handleSubmit,
    getValues,
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(validationRules),
    defaultValues: defaultData,
  });

  useEffect(() => {
    reset(defaultData);
  }, [defaultData]);

  const { isValid, errors, isLoading } = formState;

  if (errors && Object.keys(errors).length > 0) {
    console.log(errors);
  }

  const submitForm = async (data: any) => {
    if (!action) return;

    try {
      const response: actionResult = await action(data);
      if (!response) {
        return;
      }
      if (response.message) {
        toast(response.message);
      }
      if (response.error) {
        setError(response.error.path, {
          message: response.error.message,
        });
      }
      if (response.redirect) {
        replace(response.redirect);
        return;
      }
    } catch (e) {
      console.log(e);
      return "An error occured";
    }
  };

  const renderField = (field: FormField) => {
    const type = field.type;
    const label = field.label;
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
              <RichEditor
                name={name}
                onChange={onChange}
                value={value}
                label={label}
              />
            )}
          />
        )}

        {["fileUpload"].includes(type) && (
          <Controller
            control={control}
            name={field.name}
            render={({ field: { onChange, value, name } }) => {
              return (
                <FileUploader
                  name={name}
                  onChange={(e) => {
                    onChange(e);
                    if (field.onChange) {
                      field.onChange(e);
                    }
                  }}
                  value={value}
                  allowedTypes={["image/png", "image/jpeg", "video/mp4"]}
                  //onFileSelect={async (data) => {}}
                />
              );
            }}
          />
        )}

        {["mediaUploader"].includes(type) && (
          <Controller
            control={control}
            name={field.name}
            render={({ field: { onChange, name } }) => {
              return (
                <MediaUploader
                  name={name}
                  onChange={(e) => {
                    onChange(e);
                    if (field.onChange) {
                      field.onChange(e);
                    }
                  }}
                  allowedTypes={["image/png", "image/jpeg", "video/mp4"]}
                />
              );
            }}
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
    const Content = render({
      fields: fieldsToRender,
      formState,
      setValue,
      getValues,
      trigger,
    });
    return (
      <>
        <form onSubmit={handleSubmit(submitForm)}>{Content}</form>
      </>
    );
  }

  const fieldNames = fields.map((f) => f.name);
  const commonErrorMessages = Object.keys(errors).filter(
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

        {commonErrorMessages.map((e) => (
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
