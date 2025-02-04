"use client";
import { FormField } from "@/resources/resources.types";
import { urlToFile } from "@/utils";
import { useEffect, useState } from "react";

export function useUploadFields(form: FormField[], data: any) {
  const [newData, setNewData] = useState(data);
  useEffect(() => {
    async function getFields() {
      const fields = form.filter((f) => f.type === "fileUpload");
      for (const field of fields) {
        const value = data[field.name];
        const path = process.env.NEXT_PUBLIC_UPLOAD_DIR;
        if (value) {
          const file = await urlToFile(path + "/" + value, value, "image/png");
          data[field.name] = { file, previousFile: file, isDirty: false };
        }
      }
      setNewData({ ...data });
    }
    if (data) {
      getFields();
    }
  }, [form, data]);
  return newData;
}
