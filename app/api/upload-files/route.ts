import { uploadFiles } from "@/actions/files";
import { NextResponse as NextServerResponse } from "next/server";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "300mb",
    },
  },
};

export async function POST(req: Request) {
  const formData = await req.formData();

  try {
    await uploadFiles(formData);
  } catch (e) {
    return new NextServerResponse(
      JSON.stringify({
        message: "Error uploading file(s).",
      }),
      { status: 500 }
    );
  }

  return new NextServerResponse(
    JSON.stringify({
      message: "Files uploaded successfully.",
    }),
    { status: 200 }
  );
}
