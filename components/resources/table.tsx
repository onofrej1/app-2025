'use client'
import React from "react";
import Table, { TableData } from "../table/table";
import { resources } from "@/resources";
import TableActions from "@/components/table/table-actions";

interface TableProps {
  resource: string;
  data: TableData[];
  totalRows: number;
}

export default function ResourceTable(props: TableProps) {
  const { resource: resourceName, data, totalRows } = props;
  const resource = resources.find(r => r.resource === resourceName);
  if (!resource) {
    throw new Error('Resource not found');
  }
  return (
    <div>
      <Table
        headers={resource.list}
        data={data}
        actions={<TableActions />}
        totalRows={totalRows}
      />
    </div>
  );
}
