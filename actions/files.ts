"use server";

import { writeFile } from "fs/promises";
import path from "node:path";

const fs = require("fs").promises;
const defaultUploadDir = "public/uploaded_files/"

export async function uploadFile(formData: FormData, uploadDir = null) {
  const dir = uploadDir ?? defaultUploadDir;

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("An error occured");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");

  try {
    await writeFile(path.join(process.cwd(), dir + filename), buffer);
  } catch (error) {
    console.log("Error occured ", error);
    throw error;
  }
}

export async function uploadFiles(formData: FormData, uploadDir = null) {
  const count = formData.get("count");
  const dir = uploadDir ?? defaultUploadDir;

  for (let i = 0; i < Number(count); i++) {
    const file = formData.get("file-" + i) as File;
    if (!file) {
      throw new Error("An error occured");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(" ", "_");

    try {
      await writeFile(path.join(process.cwd(), dir + filename), buffer);
    } catch (error) {
      console.log("Error occured ", error);
      throw error;
    }
  }
}

export async function deleteFile(file: { path: string; name: string }) {
  const f = await fs.readFile(file.path + "/" + file.name);
  if (f) {
    //fs.unlink(file.path + "/" + file.name);
  }
  return "done";
}

export async function readDirectory(dir: string) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const data = [];
  for (const file of files) {
    const f = await fs.readFile(file.path + "/" + file.name, {
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
