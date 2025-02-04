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

export function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    // this is important
    video.autoplay = true;
    video.muted = true;
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
      let ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      video.pause();
      return resolve(canvas.toDataURL("image/png"));
    };
  });
}

export function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
  return str;
}

export async function urlToFile(
  url: string,
  filename: string,
  mimeType: "image/png"
) {  
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return new File([buffer], filename, { type: mimeType });
}

export function htmlToJson(div: Element) {
  var tag: Record<string, any> = {};
  tag["tagName"] = div.tagName;
  tag["children"] = [];
  for (var i = 0; i < div.children.length; i++) {
    tag["children"].push(htmlToJson(div.children[i]));
  }
  for (var i = 0; i < div.attributes.length; i++) {
    var attr = div.attributes[i];
    tag["@" + attr.name] = attr.value;
  }
  return tag;
}
