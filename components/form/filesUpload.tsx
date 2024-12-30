import { deleteFile, readDirectory, uploadFiles } from "@/actions/files";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/flowbite/button";
import { XIcon } from "lucide-react";

const MAX_COUNT = 5;

export default function FileUploader() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileLimit, setFileLimit] = useState(false);
  const [files, setFiles] = useState<{ src: string; name: string; path: string }[]>([]);

  const handleUploadFiles = (files: File[]) => {
    const uploaded = [...uploadedFiles];
    let limitExceeded = false;
    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) setUploadedFiles(uploaded);
  };

  const handleFileChange = (e: any) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  const removeFile = (file: File) => {
    const files = uploadedFiles.filter((f) => f.name !== file.name);
    setUploadedFiles(files);
  };

  const unlinkFile = (file: { name: string; path: string }) => {
    deleteFile(file);
    fetchFiles();
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append("count", uploadedFiles.length.toString());
    uploadedFiles.forEach((file, index) => {
      console.log(index);
      formData.append("file-" + index, file, file.name);
    });
    await uploadFiles(formData);
    await fetchFiles();
  };

  const handleDrop = (event: any) => {
    //console.log('drop');
    event.preventDefault();
    //console.log(event);
    //console.log(event.originalEvent.dataTransfer.files);
    const droppedFiles = event.dataTransfer.files as File[];
    console.log(droppedFiles);
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      handleUploadFiles(newFiles);
      //setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const fetchFiles = async () => {
    const data = await readDirectory();
    setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      {uploadedFiles && uploadedFiles.length > 0 ? (
        <div>
          <div className="grid grid-cols-3 mb-2 gap-2">
            {uploadedFiles.map((file) => (
              <div className="relative" key={file.name}>
                <img
                  className="object-cover w-full h-full"
                  src={URL.createObjectURL(file)}
                />
                <div className="bg-white rounded-full w-6 h-6 absolute top-3 right-3 flex items-center justify-center">
                  <XIcon onClick={() => removeFile(file)} className="size-4" />
                </div>
              </div>
            ))}
          </div>

          <Button onClick={onFileUpload}>Upload files!</Button>
        </div>
      ) : (
        ""
      )}
      <>
        Choose a file...
        <div className="flex items-center justify-center w-full"  onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}>
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
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <h2>Uploaded files</h2>
        <div className="grid grid-cols-3 mb-2 gap-2">
          {files.map((file) => (
            <div className="relative" key={file.name}>
              <img
                className="object-cover w-full h-full"
                src={"data:image/png;base64," + file.src}
              />
              <div className="bg-white rounded-full w-6 h-6 absolute top-3 right-3 flex items-center justify-center">
                <XIcon onClick={() => unlinkFile(file)} className="size-4" />
              </div>
            </div>
          ))}
        </div>
        {/*<input type="file" onChange={handleFileChange} />*/}
      </>
    </div>
  );
}
