import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toPlainObject(args: any) {
  return JSON.parse(JSON.stringify(args));
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

export function getSelectOptions(data: any[], labelKey: any) {
  return data.map((value: any) => ({
    value: value.id,
    label: value[labelKey],
  }));
}

export function renderSelectOptions(data: any[], render: any) {
  return data.map((value: any) => ({
    value: value.id,
    label: render(value),
  }));
}