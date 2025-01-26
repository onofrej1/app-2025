import fs from 'fs';
import { NextResponse as NextServerResponse } from 'next/server';
import path from 'path';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '300mb'
        }
    }
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return new NextServerResponse(
      JSON.stringify({ message: 'No file uploaded' }),
      { status: 400 }
    );
  }

  const defaultUploadDir = "public/uploaded_files/"
  const targetPath = path.join(process.cwd(), defaultUploadDir);

  try {
    // Ensure uploads directory exists
    fs.mkdirSync(targetPath, { recursive: true });

    const filePath = path.join(targetPath, file.name);

    // Read the file buffer directly instead of using FileReader
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    fs.writeFileSync(filePath, buffer);

    return new NextServerResponse(
      JSON.stringify({
        message: 'File uploaded successfully',
        fileUrl: `${defaultUploadDir}${file.name}`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving file:', error);
    return new NextServerResponse(
      JSON.stringify({
        message: 'Error uploading file',
      }),
      { status: 500 }
    );
  }
}