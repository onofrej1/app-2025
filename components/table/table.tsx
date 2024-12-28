"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ButtonProps } from "@/components/ui/button";
import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { JSX } from "react";
import React from "react";

type IconNames = "edit" | "delete";

export interface TableData {
  [key: string]: any;
}

export interface TableHeader {
  name: string;
  header: string;
  render?: (data: TableData) => JSX.Element;
}

interface TableActionResponse {
  message?: string;
  redirect?: string;
}

export interface TableAction {
  label: string;
  action: (data: TableData) => TableActionResponse | void;
  icon?: IconNames;
  variant?: ButtonProps["variant"];
}

interface TableProps {
  headers: TableHeader[];
  data: TableData[];
  totalRows: number;
  //actions?: ReactNode; //TableAction[];
  actions: JSX.Element;
}

const toggleSort = (direction: string | null) => {
  if (!direction) return "asc";
  if (direction === "asc") return "desc";
  if (direction === "desc") return null;
};

const getSortIcon = (direction: string | null) => {
  if (direction === "asc") return ArrowUpWideNarrow;
  if (direction === "desc") return ArrowDownWideNarrow;
  return ArrowDownUp;
};

export default function TableComponent({
  headers,
  data,
  actions: Actions,
}: TableProps) {
  const searchParams = useSearchParams();
  const { replace, push } = useRouter();
  const pathname = usePathname();

  const sortTable = (column: string) => {
    const params = new URLSearchParams(searchParams);
    const currSortBy = params.get("sortBy");
    const currDirection = params.get("sortDir");
    params.set("page", "1");

    const dir = currSortBy === column ? toggleSort(currDirection) : "asc";
    if (dir) {
      params.set("sortBy", column);
      params.set("sortDir", dir);
    } else {
      params.delete("sortBy");
      params.delete("sortDir");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const Icon = getSortIcon(searchParams.get("sortDir"));
  const sortBy = searchParams.get("sortBy");

  return (
    <>
      <Table>
        {/*<TableCaption>A list of entities.</TableCaption>*/}
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead
                key={header.name}
                onClick={() => sortTable(header.name)}
              >
                <div className="table-header flex flex-row gap-2 items-center cursor-pointer">
                  {header.header}{" "}
                  {sortBy === header.name ? (
                    <Icon size={14} />
                  ) : (
                    <ArrowDownUp className="sort-icon" size={14} />
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {headers.map((header) => (
                <TableCell key={header.name}>
                  {header.render ? header.render(row) : row[header.name]}
                </TableCell>
              ))}
              <TableCell className="py-0">
                <div className="flex flex-row gap-1 justify-end">
                  {React.cloneElement(Actions, { row })}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
