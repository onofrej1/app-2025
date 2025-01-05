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

export const parseCsv = (content: string) => {
  const lines = content.split("\n");  
  const csvArray = [];

  const header = lines.shift();
  const headers = header?.split(",");

  if (!headers || headers.length === 0) {
    throw new Error('Missing headers');
  }
  for (const line of lines) {
    const splitLine = line.split(",");
    const record: Record<string, string> = {};
    headers.forEach((key, index) => {
      record[key] = splitLine[index];
    });
    csvArray.push(record);
  }
  return csvArray;
};
