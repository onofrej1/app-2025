import Table from "@/components/table/table";
import { resources } from "@/resources";
import { redirect } from "next/navigation";
import TableFilter from "@/components/table/table-filter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { prismaQuery } from "@/db";
import TablePagination from "@/components/table/table-pagination";
import TableActions from "@/components/table/table-actions";

interface ResourceProps {
  params: {
    name: string;
  };
  searchParams: { [key: string]: string };
}

export default async function Resource({
  params,
  searchParams,
}: ResourceProps) {

  const {
    page,
    pageCount,
    sortBy = "id",
    sortDir = "asc",
    ...where
  } = await searchParams;
  const resourceName = (await params).name;

  //const author = await prisma.user.findFirstOrThrow();
  for (let i = 0; i < 20; i++) {
    //await prisma.post.create({ data: { title: 'Title'+i, content: 'Content'+i, author: { connect: { id: author.id }} }});
  }

  const resource = resources.find((r) => r.resource === resourceName);
  const resourcePath = `/resource/${resourceName}`;
  if (!resource) {
    throw new Error(`Resource ${resourceName} not found !`);
  }

  const whereQuery = Object.keys(where).reduce((acc, k) => {
    const value = where[k];
    if (value === "") return acc;
    acc[k] = { contains: value };
    return acc;
  }, {} as Record<string, unknown>);

  const totalRows = await prismaQuery(resource.model, "count", {
    where: whereQuery,
  });

  const skip = (Number(page) || 1) - 1;
  const take = Number(pageCount) || 10;

  const args = {
    where: whereQuery,
    skip: skip * take,
    take: take,
    orderBy: [{ [sortBy]: sortDir }],
  };
  const data = await prismaQuery(resource.model, "findMany", args);

  const createResource = async () => {
    "use server";
    redirect(`${resourcePath}/add`);
  };

  return (
    <div className="w-full">
      <div className="flex flex-row items-end justify-between">
        <TableFilter />
        <form action={createResource}>
          <Button variant="outline" type="submit">
            <Plus className="h-5 w-5" /> Add item
          </Button>
        </form>
      </div>
      <div>
        <Table
          headers={resource.list}
          data={data}
          actions={<TableActions />}
          totalRows={totalRows}
        />
        <TablePagination totalRows={totalRows} />
      </div>
    </div>
  );
}
