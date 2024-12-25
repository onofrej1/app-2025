"use client"

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce';
//import FormSelect from "./form/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TablePaginationProps {
  totalRows: number,
}

export default function TablePagination({ totalRows }: TablePaginationProps) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageCount = searchParams.get('pageCount') || 10;
  const page = Number(searchParams.get('page')) || 1;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    replace(`${pathname}?${params.toString()}`);
  }

  const handlePageCount = useDebouncedCallback((pageCount: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('pageCount', pageCount);
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const pageCountOptions = [10, 20, 50].map(v => ({ label: v.toString(), value: v }));

  const totalPages = Math.ceil(totalRows / Number(pageCount));
  console.log(totalPages);

  return (
    <div className="flex flex-row ga-2 items-center justify-center">
      <Pagination className="w-auto mx-6">
        <PaginationContent>
          <PaginationItem>
            {page === 1 ?
              <PaginationPrevious className="text-gray-400 pointer-events-none" />
              : <PaginationPrevious href="#" onClick={() => goToPage(page - 1)} />}
          </PaginationItem>
          {page > 1 && <PaginationItem>
            <PaginationLink>{page - 1}</PaginationLink>
          </PaginationItem>}
          <PaginationItem>
            <PaginationLink isActive>
              {page}
            </PaginationLink>
          </PaginationItem>
          {page < totalPages && <PaginationItem>
            <PaginationLink>{page + 1}</PaginationLink>
          </PaginationItem>}
          {page < totalPages && <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>}
          <PaginationItem>
            {page < totalPages ?
              <PaginationNext href="#" onClick={() => goToPage(page + 1)} />
              : <PaginationNext className="text-gray-400 pointer-events-none" />}

          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <span className="pr-2">Pages</span>
      {/*<FormSelect
        name="pageCount"
        inline
        value={pageCount?.toString()}
        onChange={handlePageCount}
        options={pageCountOptions}
      />*/}
    </div>
  )
}