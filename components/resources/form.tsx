"use client";
import React from "react";
import Form from "@/components/form/form";
import { addResource, updateResource } from "@/actions/resources";
import { resources } from "@/resources";
import { useFormFields } from "@/hooks/useFormFields";
import { deleteFile, uploadFiles } from "@/actions/files";

interface ResourceFormProps {
  resource: string;
  data?: any;
}

export default function ResourceForm(props: ResourceFormProps) {
  const { resource: resourceName, data = {} } = props;
  const resource = resources.find((r) => r.resource === resourceName);

  if (!resource) {
    throw new Error("Resource not found");
  }
  const fields = useFormFields(resource.form, !!data.id);

  const submit = async (data: any) => {
    const uploadData = new FormData();
    for(const field of fields) {
      if (field.type === 'fileUpload') {
        const { file, previousFile, isDirty } = data[field.name];
        if (!isDirty) return;
        if (previousFile) {
          await deleteFile(previousFile.name);
        }
        if (file) {          
          uploadData.append(field.name, file, file.name);
          data[field.name] = file.name;
        } else {
          data[field.name] = null;
        }
      }
    }

    if (!uploadData.entries().next().done) {
      await uploadFiles(uploadData);
    }
    if (data?.id) {
      return updateResource(resource, data);
    } else {
      return addResource(resource, data);
    }
  }

  return (
    <div className="w-[60%] mx-auto">
      <Form
        fields={fields}
        validation={resource.rules}
        data={data}
        render={resource.renderForm}
        action={submit}
      />
    </div>
  );
}
