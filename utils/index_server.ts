import fs from "fs";
import { NextResponse as NextServerResponse } from "next/server";
import path from "path";

const sizeOf = require("image-size");

export function getImageOrientation(imagePath: string) {
  const dir = process.cwd() + "/public";
  try {
    const dimensions = sizeOf(dir + imagePath);
    const { width, height } = dimensions;
    if (width > height) {
      return "HORIZONTAL";
    } else if (height > width) {
      return "VERTICAL";
    } else {
      return "SQUARE";
    }
  } catch (err) {
    console.error("Error reading image dimensions:", err);
    return "SQUARE";
  }
}

export async function uploadFiles(formData: FormData, uploadDir?: string) {
  const keys = Array.from(formData.keys());

  for (let i = 0; i < Number(keys.length); i++) {
    const file = formData.get(keys[i]) as File;

    if (!file) {
      throw new Error("Missing file data:" + keys[i]);
    }

    const defaultUploadDir = "public/uploaded_files/";
    const targetPath = path.join(process.cwd(), uploadDir || defaultUploadDir);

    try {
      fs.mkdirSync(targetPath, { recursive: true });

      const filePath = path.join(targetPath, file.name);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fs.writeFileSync(filePath, buffer);
    } catch (error) {
      return new NextServerResponse(
        JSON.stringify({
          message: "Error uploading file",
        }),
        { status: 500 }
      );
    }
  }
  return { status: "success" };
}
