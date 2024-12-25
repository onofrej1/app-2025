"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, ButtonProps } from "@/components/ui/button";
import { LucideIcon, Pencil, Trash2, ArrowDownUp, ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner"

type IconNames = 'edit' | 'delete';

export const Icons: Record<IconNames, LucideIcon> = {
  'edit': Pencil,
  'delete': Trash2,
}

export interface TableData {
  [key: string]: any;
}

export interface TableHeader {
  name: string;
  header: string;
}

interface TableActionResponse {
  message: string;
}

export interface TableAction {
  label: string;  
  action: (data: TableData) => Promise<TableActionResponse> | void;
  icon?: IconNames;
  variant?: ButtonProps['variant'];
}

interface TableProps {
  headers: TableHeader[];
  data: TableData[];
  totalRows: number;
  actions?: TableAction[];
}

const toggleSort = (direction: string | null) => {
  if (!direction) return 'asc';
  if (direction === 'asc') return 'desc';
  if (direction === 'desc') return null;
}

const getSortIcon = (direction: string | null) => {
  if (direction === 'asc') return ArrowUpWideNarrow;
  if (direction === 'desc') return ArrowDownWideNarrow;
  return ArrowDownUp;
}

export default function TableComponent({ headers, data, actions }: TableProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const sortTable = (column: string) => {
    const params = new URLSearchParams(searchParams);
    const currSortBy = params.get('sortBy');
    const currDirection = params.get('sortDir');
    params.set('page', '1');

    const dir = currSortBy === column ? toggleSort(currDirection) : 'asc';
    if (dir) {
      params.set('sortBy', column);
      params.set('sortDir', dir);
    } else {
      params.delete('sortBy');
      params.delete('sortDir');
    }

    replace(`${pathname}?${params.toString()}`);
  };

  const Icon = getSortIcon(searchParams.get('sortDir'));
  const sortBy = searchParams.get('sortBy');

  return (
    <>
      <Table>
        {/*<TableCaption>A list of entities.</TableCaption>*/}
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header.name} onClick={() => sortTable(header.name)}>
                <div className="table-header flex flex-row gap-2 items-center cursor-pointer">
                  {header.header} {sortBy === header.name ? <Icon size={14} />
                    : <ArrowDownUp className="sort-icon" size={14} />}
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
                  {row[header.name]}
                </TableCell>
              ))}
              <TableCell className="py-0">
                <div className="flex flex-row gap-1">
                {actions?.map((action) => {
                  const Icon = action.icon ? Icons[action.icon] : null;
                  return (
                    <Button 
                      size={"sm"}
                      variant={action.variant || 'default'}
                      onClick={async () => {
                        const response = await action.action(row);
                        if (response && response.message) {
                          toast(response.message);
                        }
                      }}
                      key={action.label} 
                      className="flex flex-row gap-2">
                      {Icon && <Icon size={14} />}
                      {action.label}
                    </Button>
                  )
                })}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}