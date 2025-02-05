import { useState } from "react";
import axios from "axios";

const defaultUploadUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/upload-files";

interface UploadFile {
  fileName: string;
  file: File;
  progress: number;
  error?: boolean;
  errorMessage?: string;
}

export const useUploadFiles = (/*url: string = defaultUploadUrl*/) => {
  const [progress, setProgress] = useState("notStarted");
  const [uploadingFiles, setUploadingFiles] = useState<UploadFile[]>([]);

  const uploadFiles = async (files: File[]) => {
    setProgress("uploading");

    files.forEach((file) => {
      const formData = new FormData();
      formData.append("file", file, file.name);

      axios
        .post(defaultUploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (!progressEvent?.total) return;
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setUploadingFiles((oldFiles) => {
              let updateFile = oldFiles.find((f) => f.fileName === file.name);
              if (!updateFile) {
                updateFile = {
                  file,
                  fileName: file.name,
                  progress: percentCompleted,
                };
              }
              updateFile.progress = percentCompleted;

              const existing = oldFiles.filter((f) => f.fileName !== file.name);
              const newFiles = [...existing, updateFile];
              setProgress(() => {
                const totalFiles = newFiles.filter(
                  (f) => f.progress === 100 || f.error
                );
                return totalFiles.length === files.length
                  ? "done"
                  : "uploading";
              });
              return newFiles;
            });
          },
        })
        .catch((e) => {
          const message = "An error occured uploading file: " + file.name;

          setUploadingFiles((oldFiles) => {
            let updateFile = oldFiles.find((f) => f.fileName === file.name);

            if (!updateFile) {
              updateFile = {
                file,
                fileName: file.name,
                progress: 0,
              };
            }
            updateFile.progress = 0;
            updateFile.error = true;
            updateFile.errorMessage = message;

            const existing = oldFiles.filter((f) => f.fileName !== file.name);
            const newFiles = [...existing, updateFile];
            setProgress(() => {
              const totalFiles = newFiles.filter(
                (f) => f.progress === 100 || f.error
              );
              return totalFiles.length === files.length ? "done" : "uploading";
            });
            return newFiles;
          });
        });
    });
  };

  const resetUpload = () => {
    setProgress('notStarted');
    setUploadingFiles([]);
  }

  return { uploadFiles, uploadingFiles, progress, resetUpload };
};
