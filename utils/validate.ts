import { FormField } from "@/resources/resources.types";
import rules, { FormSchema } from "@/validation";
import { ZodError } from "zod";

export function parseValidationErrors(e: ZodError): ValidationResult {
  return {
    status: "error",
    message: "Invalid form data.",
    errors: e.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  };
}

export type ValidationResult =
  | {
      status: "success";
      data: any;
    }
  | {
      status: "error";
      message: string;
      errors?: Array<{
        path: string;
        message: string;
      }>;
    };

export function validateForm(
  fields: FormField[],
  formSchema: FormSchema,
  formData: FormData
): ValidationResult {
  try {
    const data: { [key: string]: any } = {};
    fields.forEach((field) => {
      data[field.name] =
        field.type === "m2m"
          ? formData.getAll(field.name)
          : formData.get(field.name);
    });
    const validation = rules[formSchema];
    const parsedData = validation ? validation.parse(data) : data;
    return { status: "success", data: parsedData };
  } catch (e) {
    if (e instanceof ZodError) {
      return parseValidationErrors(e);
    }
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }
}
