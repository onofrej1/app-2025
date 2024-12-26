import { uploadFile } from "@/actions";
import React, { useState } from "react";
import { Button } from "@/components/ui/flowbite/button";

export default function FileUploader() {
  const [file, setFile] = useState<File>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file_ = event.target.files[0];

    if (file_.type !== "image/png" && file_.type !== "image/jpeg") {
      alert("Please select a PNG or JPEG image file.");
      return;
    }

    if (file_.size > 1024 * 1024) {
      alert("File size should not exceed 1MB.");
      return;
    }
    console.log(URL.createObjectURL(file_));
    setFile(file_);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append("myFile", file, file.name);
    uploadFile(formData);
  };

  return (
    <div>
      {file ? (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {file.name}</p>
          <p>File Type: {file.type}</p>
          <div>
            Last Modified:
            {new Date(file.lastModified).toDateString()}
            <div className="w-[80%] mx-auto">
              <img src={URL.createObjectURL(file)} width={"100%"} />
            </div>
          </div>
          <Button onClick={onFileUpload}>Upload!</Button>
        </div>
      ) : (
        <>
          Choose a file...
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
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
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
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
