"use server";

import { writeFile } from "fs/promises";
import path from "node:path";

const fs = require("fs").promises;

export async function uploadFiles(formData: FormData, uploadDir = null) {
  const count = formData.get("count");
  const dir = uploadDir ?? "public/assets/";

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

export async function readDirectory() {
  const f = await fs.readdir("./public/assets", { withFileTypes: true });
  const data = [];
  for (const file of f) {
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
