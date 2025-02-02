import { useState } from "react";
import axios from "axios";

const defaultUploadUrl = process.env.NEXT_PUBLIC_BASE_URL+ "/api/upload-files";

export const useUploadForm = (/*url: string = defaultUploadUrl*/) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadForm = async (formData: FormData) => {
    console.log(defaultUploadUrl);
    const response = await axios.post(defaultUploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (!progressEvent?.total) return;
        if (progressEvent.lengthComputable) {
            const value = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setProgress(value);
        }        
      },
      /*onDownloadProgress: (progressEvent) => {
        if (!progressEvent?.total) return;
        const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;        
        setProgress(progress);
      },*/
    });
    if (response.status === 200) {
      setIsSuccess(true);      
    }
    return response;
  };

  return { uploadForm, isSuccess, progress };
};