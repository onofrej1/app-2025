import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  allowedTypes?: string[];
  maxSize?: number;
  uploadText?: string;
}

export default function FileUploader(props: FileUploaderProps) {
  const allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
  const {
    onFileSelect,
    allowedTypes = allowedFileTypes,
    maxSize = 1024 * 1024,
    uploadText,
  } = props;
  const [file, setFile] = useState<File>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    if (!uploadedFile) return;

    if (!allowedTypes.includes(uploadedFile.type)) {
      alert("This file type is not supported !");
      return;
    }

    if (uploadedFile.size > maxSize) {
      alert("Uploaded file is too big !");
      return;
    }
    setFile(uploadedFile);
  };

  const selectFile = () => {
    if (file) {
      onFileSelect(file); 
    }    
  };

  const isImageFile = (type: string) => {
    return ["image/jpeg", "image/png"].includes(type);
  };

  return (
    <div>
      {file ? (
        <div className="flex flex-col justify-center">
          {isImageFile(file.type) && (
            <div className="grid grid-cols-1 mb-2">
              <img src={URL.createObjectURL(file)} width={"100%"} />
            </div>
          )}
          <div className="text-center">
            <Button size={'sm'} onClick={selectFile}>
              <Upload />
              {uploadText || "Upload file"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          Choose a file...
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {/*<input type="file" onChange={handleFileChange} />*/}
        </>
      )}
    </div>
  );
}
