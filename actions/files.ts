"use server";

import path from "node:path";

const fs = require("fs");
const defaultUploadDir = process.env.UPLOAD_DIR!;

export async function uploadFiles(formData: FormData, uploadDir?: string) {
  const keys = Array.from(formData.keys());

  for (let i = 0; i < Number(keys.length); i++) {
    const file = formData.get(keys[i]) as File;

    if (!file) {
      throw new Error("Missing file data:" + keys[i]);
    }

    const targetPath = path.join(process.cwd(), uploadDir || defaultUploadDir);

    try {
      fs.mkdirSync(targetPath, { recursive: true });
      const filePath = path.join(targetPath, file.name);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fs.writeFileSync(filePath, buffer);
    } catch (error) {
      console.log(error);
      return { status: 'error' };
    }
  }
  return { status: "success" };
}

export async function deleteFile(filePath: string) {
  const file = path.join(process.cwd(), defaultUploadDir, filePath);
  const fileToDelete = await fs.readFile(file);
  if (fileToDelete) {
    fs.unlink(file);
  }
  return { success: true };
}

export async function readDirectory(dir: string) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const data = [];
  for (const file of files) {
    const filePath = path.join(file.path, file.name);
    const f = await fs.readFile(filePath, {
      encoding: "base64",
    });
    data.push({
      src: f,
      name: file.name,
      path: file.path,
    });
  }
  return data;
}
