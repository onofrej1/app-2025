"use server";

import { prismaQuery } from "@/db";
import { Resource } from "@/resources/resources.types";
import { uploadFiles } from "@/utils/index_server";
import { revalidatePath } from "next/cache";

export async function addResource(resource: Resource, formData: FormData) {
  const data: any = Object.fromEntries(formData.entries());
  const keys = Array.from(formData.keys());

  const uploadFormData = new FormData();
  for (let i = 0; i < Number(keys.length); i++) {
    const fieldName = keys[i];
    const value = formData.get(keys[i]);
    if (value instanceof Object && value.type) {
      data[fieldName] = value.name;
      uploadFormData.append(fieldName, value, value.name);
    }
  }
  try {
    await uploadFiles(uploadFormData);
  } catch (e) {
    return { status: "error", message: "Error uploading file(s)." };
  }

  const form = resource.form;
  form.forEach((field) => {
    if (field.type === "fk") {
      data[field.relation!] = { connect: { id: data[field.name] } };
      delete data[field.name!];
    }

    if (field.type === "m2m") {
      const values = data[field.name]
        .split(',')
        .filter(Boolean)
        .map((value: number) => ({ id: Number(value) }));
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

export async function updateResource(resource: Resource, formData: FormData) {
  const parsedData: any = Object.fromEntries(formData.entries());
  const keys = Array.from(formData.keys());

  const uploadFormData = new FormData();
  for (let i = 0; i < Number(keys.length); i++) {
    const fieldName = keys[i];
    const value = formData.get(keys[i]);
    if (value instanceof Object && value.type) {
      parsedData[fieldName] = value.name;
      uploadFormData.append(fieldName, value, value.name);
    }
  }
  try {
    await uploadFiles(uploadFormData);
  } catch (e) {
    return { status: "error", message: "Error uploading file(s)." };
  }

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
        .split(',')
        .filter(Boolean)
        .map((value: string) => ({ id: Number(value) }));
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
