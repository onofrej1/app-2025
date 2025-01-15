import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  if (date instanceof Date) {
    return date.toLocaleDateString();
  }
  return new Date(date).toLocaleDateString();
}

export const capitalize = (s: string) =>
  s && String(s[0]).toUpperCase() + String(s).slice(1);

export const parseCsv = (content: string, requiredHeaders: string[]) => {
  const lines = content.split("\n").filter(Boolean);
  const csvArray = [];

  const header = lines.shift();
  const headers = header?.split(",");

  const hasAllHeaders = requiredHeaders.every((header) =>
    headers?.includes(header)
  );
  if (!headers || !hasAllHeaders) {
    throw new Error("Missing headers");
  }

  for (const line of lines) {
    const splitLine = line.split(",");
    const record: Record<string, any> = {};
    headers.forEach((key, index) => {
      record[key] = splitLine[index].trim();
    });
    csvArray.push(record);
  }
  return csvArray;
};

export const hmsToSeconds = (hms: string) => {
  const a = hms.split(":");
  const seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

  return seconds;
};

export const groupArrayByKey = function (xs: any[], key: any) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
