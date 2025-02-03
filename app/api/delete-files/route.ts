import { NextResponse as NextServerResponse } from "next/server";

const fs = require("fs").promises;

export async function POST(req: Request) {
  const data = await req.json();  

  try {
    const f = await fs.readFile(data.file);
    console.log(f);
    if (f) {
      //fs.unlink(file.path + "/" + file.name);
      return new NextServerResponse(
        JSON.stringify({
          message: "File deleted successfully.",
        }),
        { status: 200 }
      );
    }
  } catch (e) {
    return new NextServerResponse(
      JSON.stringify({
        message: "Error uploading file(s).",
      }),
      { status: 500 }
    );
  }
}
