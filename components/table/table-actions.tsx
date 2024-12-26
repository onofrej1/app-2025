"use client";
import React from "react";
import { TableAction, TableData } from "./table";
import { useParams, useRouter } from "next/navigation";
import { useDialog } from "@/state";
import { Button } from "../ui/button";
import { LucideIcon, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteResource } from "@/actions";
import { resources } from "@/resources";

type IconNames = "edit" | "delete";

export const Icons: Record<IconNames, LucideIcon> = {
  edit: Pencil,
  delete: Trash2,
};

export default function TableActions({ row }: { row?: any }) {
  const { onOpen, setTitle, setConfirmLabel, setCancelLabel, setAction } =
    useDialog();
  const { push } = useRouter();
  const params = useParams();
  const resource = resources.find((r) => r.resource === params.name);
  const deleteRow = DeleteResource.bind(null, resource, row.id);

  const resourcePath = `resources/${resource.resource}`; //"categories";

  const actions: TableAction[] = [
    {
      label: "Edit",
      icon: "edit",
      action: (data: TableData) => {
        return { redirect: `${resourcePath}/${data.id}/edit` };
      },
    },
    {
      label: "Delete",
      icon: "delete",
      variant: "outline",
      action: (data: TableData) => {
        setAction(deleteRow);
        setTitle("Really delete row with id: " + data.id);
        setCancelLabel("Cancel");
        setConfirmLabel("Yes delete");
        onOpen();
      },
    },
  ];

  return (
    <>
      {actions?.map((action) => {
        const Icon = action.icon ? Icons[action.icon] : null;
        return (
          <Button
            size={"sm"}
            variant={action.variant || "default"}
            onClick={async () => {
              const response = await action.action(row);
              if (response && response.message) {
                toast(response.message);
              }
              if (response && response.redirect) {
                push(response.redirect);
              }
            }}
            key={action.label}
            className="flex flex-row gap-2"
          >
            {Icon && <Icon size={14} />}
            {action.label}
          </Button>
        );
      })}
    </>
  );
}
