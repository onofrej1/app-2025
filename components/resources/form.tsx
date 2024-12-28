'use client'
import React from "react";
import Form from "../form/form";
import { addResource, updateResource } from "@/actions";
import { resources } from "@/resources";
import { FormField } from "@/resources/resources.types";

interface ResourceFormProps {
  resource: string;
  fields: FormField[];
  data?: any;
}

export default function ResourceForm(props: ResourceFormProps) {
  const { resource: resourceName, fields, data = {} } = props;
  const resource = resources.find(r => r.resource === resourceName);
  const action = data && data.id ? updateResource.bind(null, resource) : addResource.bind(null, resource);  

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
