import { getResults, getResultsByRunId } from "@/actions/results";
import Table from "@/components/table/table";
import React from "react";

interface ResultsProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string }>;
}
export default async function Results({ params }: ResultsProps) {
  const { id } = await params;
  const results = await getResultsByRunId(Number(id));
  const headers = [
    { name: "rank", header: "Rank" },
    { name: "name", header: "Name" },
    { name: "bib", header: "Bib" },
    { name: "yearOfBirth", header: "Born" },
    { name: "gender", header: "Gender" },
    { name: "category", header: "Category" },
    { name: "time", header: "Time" },
    { name: "club", header: "Club" },
  ];

  return (
    <div>
      results
      <Table data={results} headers={headers} totalRows={results.length} />
    </div>
  );
}
