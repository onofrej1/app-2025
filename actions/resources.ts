"use server";

import { prismaQuery } from "@/db";
import { Resource } from "@/resources/resources.types";
import { revalidatePath } from "next/cache";

export async function addResource(resource: Resource, data: any) {
  const form = resource.form;
  form.forEach((field) => {
    if (field.type === "fk") {
      data[field.relation!] = { connect: { id: data[field.name] } };
      delete data[field.name!];
    }

    if (field.type === "m2m") {
      const values = data[field.name]
        .filter(Boolean)
        .map((value: number) => ({ id: value }));
      if (values) {
        data[field.name] = { connect: values };
      }
    }
  });
  const args: unknown = {
    data,
  };

  await prismaQuery(resource.model, "create", args);

  return { redirect: `/resource/${resource.resource}` };
}

export async function updateResource(resource: Resource, parsedData: any) {
  const { id, ...data } = parsedData;

  const form = resource.form;
  for (const field of form) {
    if (field.type === "fk") {
      data[field.relation!] = { connect: { id: data[field.name] } };
      delete data[field.name!];
    }
    if (field.type === "m2m") {
      const args: unknown = {
        data: { [field.name]: { set: [] } },
        where: { id: Number(id) },
      };
      await prismaQuery(resource.model, "update", args);
      const values = data[field.name]
        .filter(Boolean)
        .map((value: number) => ({ id: value }));
      if (values) {
        data[field.name] = { connect: values };
      }
    }
  }
  const args: unknown = {
    data,
    where: { id: Number(id) },
  };
  await prismaQuery(resource.model, "update", args);

  return { redirect: `/resource/${resource.resource}` };
}

export async function DeleteResource(resource: Resource, id: string) {
  const args = {
    where: {
      id: Number(id),
    },
  };
  await prismaQuery(resource.model, "delete", args);
  const resourcePath = `resources/${resource.resource}`;
  revalidatePath(resourcePath);
  return { message: "Item successfully deleted." };
}
