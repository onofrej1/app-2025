import fs from "fs";
import { NextResponse as NextServerResponse } from "next/server";
import path from "path";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "300mb",
    },
  },
};

export async function POST(req: Request) {
  const formData = await req.formData();
  console.log(formData);

  const count = Array.from(formData.keys()).length; //formData.get("count");
  console.log(count);

  for (let i = 0; i < Number(count); i++) {
    const file = formData.get("file-" + i) as File;

    if (!file) {
      return new NextServerResponse(
        JSON.stringify({ message: "No file uploaded" }),
        { status: 400 }
      );
    }

    const defaultUploadDir = "public/uploaded_files/";
    const targetPath = path.join(process.cwd(), defaultUploadDir);

    try {
      fs.mkdirSync(targetPath, { recursive: true });

      const filePath = path.join(targetPath, file.name);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fs.writeFileSync(filePath, buffer);
    } catch (error) {
      console.error("Error saving file:", error);
      return new NextServerResponse(
        JSON.stringify({
          message: "Error uploading file",
        }),
        { status: 500 }
      );
    }
  }

  return new NextServerResponse(
    JSON.stringify({
      message: "Files uploaded successfully",
    }),
    { status: 200 }
  );
}
