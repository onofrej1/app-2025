"use client";
import { prismaAction } from "@/actions";
import { FormField } from "@/resources/resources.types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const getLabel = (field: FormField, value: any) => {
  return field.renderLabel ? field.renderLabel(value) : value[field.textField!];
};

export function useFormFields(form: FormField[], hasId: boolean) {
  const idField = { name: 'id', type: 'hidden'};
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    async function getFields() {
      for (const field of form.filter((f) => ["fk", "m2m"].includes(f.type!))) {
        const options = await queryClient.fetchQuery({
          queryKey: [field.resource],
          queryFn: () => prismaAction(field.resource!, "findMany", null),
        });

        field.options = options.map((value: any) => ({
          value: value.id,
          label: getLabel(field, value),
        }));
      }
      setFormFields(hasId ? [idField, ...form] : form);
    }
    getFields();
  }, []);

  return formFields;
}
