"use client";
import React from "react";
import Form from "@/components/form/form";
import { addResource, updateResource } from "@/actions/resources";
import { resources } from "@/resources";
import { useFormFields } from "@/hooks/useFormFields";

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
  const action =
    data && data.id
      ? updateResource.bind(null, resource)
      : addResource.bind(null, resource);

  return (
    <div>
      <Form
        fields={fields}
        validation={resource.rules}
        data={data}
        render={resource.renderForm}
        action={action}
      />
    </div>
  );
}
