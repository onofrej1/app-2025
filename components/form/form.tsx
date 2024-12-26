"use client";
import { Controller, FieldPath, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { JSX, startTransition, useActionState, useRef } from "react";
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
import { validateForm, ValidationResult } from "@/utils/validate";

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

export type FormRenderFunc = (props: {
  fields: Record<string, JSX.Element>;
  formState: FormState;
}) => JSX.Element;

interface FormProps {
  fields: FormField[];
  validation: FormSchema;
  data?: DefaultFormData;
  action: (...args: any[]) => any;
  buttons?: ((props: FormState) => JSX.Element)[];
  render?: FormRenderFunc;
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
    formState: { isValid, errors },
    setError,
    clearErrors,
    control,
    handleSubmit
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(validationRules),
    defaultValues: data,
  });

  const [error, submitAction, pending] = useActionState(
    async (previousState: any, formData: FormData) => {
      clearErrors();
      console.log(formData);
      const validationResult: ValidationResult = validateForm(
        fields,
        validation,
        formData
      );

      if (validationResult.status && validationResult.status === "error") {
        validationResult.errors?.forEach((error) => {
          setError(error.path as FieldPath<FormValues>, {
            message: error.message,
          });
        });
        return;
      }
      try {
        const submitResult: actionResult = await action(validationResult.data);

        if (submitResult.message) {
          toast(submitResult.message);
        }
        if (submitResult.error) {
          setError(submitResult.error.path, {
            message: submitResult.error.message,
          });
        }
        if (submitResult.redirect) {
          replace(submitResult.redirect);
          return;
        }
      } catch (e) {
        console.log(e);
        // todo parse, log error message
        return "An error occured";
      }
    },
    null
  );
  if (error) {
    toast(error);
  }

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
            console.log(value);
            return <MultiSelect
              name={name}
              options={field.options! as MultiSelectOption[]}
              onValueChange={(v) => {
                console.log(v);
                onChange(v);
              }}
              defaultValue={value}
              placeholder="Select frameworks"
              variant="inverted"
              animation={2}
              maxCount={3}
            />
            }
          }
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
      formState: { isValid, pending },
    });
    return <>{renderContent}</>;
  }

  const fieldNames = fields.map((f) => f.name);
  const restMessages = Object.keys(errors).filter(
    (e) => !fieldNames.includes(e)
  );
  const formRef = useRef<HTMLFormElement>(null);
  
  return (
    <>
      <form
      //ref={formRef}
      action={submitAction}
      /*onSubmit={(evt) => {
        evt.preventDefault();
        handleSubmit(() => {
          //startTransition(() => submitAction(new FormData(formRef.current!)));
          console.log(new FormData(formRef.current!));
          submitAction(new FormData(formRef.current!));
        })(evt);
      }}*/
      >
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
              <Button key={index} isValid={isValid} pending={pending} />
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
