import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DialogState } from "@/types";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { create } from "zustand";
import { Progress } from "../ui/progress";
import { useUploadFiles } from "@/hooks/useUploadFiles";
import { deleteFile } from "@/actions/files";

export const useUploadDialogState = create<DialogState<File[]>>((set) => ({
  isOpen: false,
  toggleModal: () =>
    set((state: DialogState<File[]>) => ({ isOpen: !state.isOpen })),
  data: null,
  setData: (data: File[]) => set(() => ({ data: data })),
}));

interface UploadDialogProps {
  name?: any;
  onChange: (files: File[]) => void;
  allowedTypes?: string[];
  maxSize?: number;
  maxFiles?: number;
  uploadText?: string;
}

export default function UploadDialog(
  props: UploadDialogProps & Pick<DialogState<File[]>, "isOpen" | "toggleModal">
) {
  const allowedFiles = ["image/png", "image/jpeg", "image/jpg"];
  const {
    onChange,
    allowedTypes = allowedFiles,
    maxSize = 1024 * 1024,
    maxFiles = 10,
    toggleModal,
    isOpen,
  } = props;

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { uploadFiles, uploadingFiles, progress, resetUpload } = useUploadFiles();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.prototype.slice.call(event.target.files);
    const uploaded = [...selectedFiles];
    let limitExceeded = false;
    files.some((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert("This file type is not supported !");
        return;
      }

      if (file.size > maxSize) {
        alert("Uploaded file is too big !");
        return;
      }
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length > maxFiles) {
          alert(`You can only add a maximum of ${maxFiles} files`);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) {
      setSelectedFiles(uploaded);
      onChange(uploaded);
    }
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files as File[];
    console.log(droppedFiles);
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
    }
  };

  const removeFile = async (selectedFiles: File[], fileName: string) => {
    const files = selectedFiles.filter((f) => f.name !== fileName);
    const uploadingFile = uploadingFiles.find((f) => f.fileName === fileName);
    if (uploadingFile && uploadingFile.progress === 100) {
      await deleteFile(uploadingFile?.fileName);
    }
    setSelectedFiles(files);
    onChange(files);
  };

  const onUploadStart = async () => {
    if (progress === "done") {
      closeModal();
      return;
    }
    await uploadFiles(selectedFiles);
  };

  const getProgress = (fileName: string) => {
    const uploadingFile = uploadingFiles.find((f) => f.fileName === fileName);
    return uploadingFile?.progress;
  };

  const getError = (fileName: string) => {
    const uploadingFile = uploadingFiles.find((f) => f.fileName === fileName);
    return uploadingFile?.error ? uploadingFile.errorMessage : null;
  };

  const closeModal = () => {
    resetUpload();
    setSelectedFiles([]);
    toggleModal();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="border border-gray p-3">
          <div
            className="flex items-center justify-center w-full mb-3"
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
          >
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
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          {selectedFiles && selectedFiles.length > 0 && (
            <div className="flex flex-col gap-3">
              {selectedFiles.map((file) => (
                <div key={file.name}>
                  <div
                    className="flex items-center justify-between"
                    key={file.name}
                  >
                    <div>{file.name}</div>
                    <div>
                      <XIcon
                        onClick={() => removeFile(selectedFiles, file.name)}
                        className="size-4 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <Progress value={getProgress(file.name)} />
                    <div className="color-red">{getError(file.name)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={onUploadStart}
            disabled={progress === "uploading"}
          >
            {progress === "done" ? "Done" : "Start upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
