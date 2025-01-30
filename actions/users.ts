"use server";

import { prisma } from "@/db/prisma";
import { getSession } from "./auth";
import { CustomFieldValue, DataType, User } from "@prisma/client";

export async function getUsers() {
  return prisma.user.findMany();
}

export async function getUserData() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  const userId = session.userId;
  const user = await prisma.user.findFirstOrThrow({ where: { id: userId }});

  const customFieldEntities = await prisma.customFieldEntity.findMany({
    where: {
      entityType: 'user',
    },
    include: {
      customField: {
        include: {
          options: true,
        }
      }
    }
  });

  const customFieldValues = await prisma.customFieldValue.findMany({
    where: {
      entityType: 'user',
      entityStrId: session.userId,
    },
  });

  const customFields = customFieldEntities.map(entityField => {
    const value = customFieldValues.find(value => value.customFieldId === entityField.customFieldId);
    const fieldType = entityField.customField.dataType;
    const fieldValue = {
      STRING: value?.stringValue,
      NUMBER: value?.numberValue,
      DATE: value?.dateValue,
      BOOLEAN: value?.booleanValue,
      TEXT: value?.textValue,
    }[fieldType];

    return { ...entityField, /*user,*/ value: fieldValue };
  });

  return { user, customFields };
}
