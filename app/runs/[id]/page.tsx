"use client";
import { getEvent } from "@/actions/events";
import { getRunById } from "@/actions/runs";
import FileUploader from "@/components/form/fileUpload";
import React, { useState } from "react";
import { uploadFiles } from "@/actions/files";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Table from "@/components/table/table";
import { parseCsv } from "@/lib/utils";

export default function Run() {
  const { id } = useParams();
  const [uploadData, setUploadData] = useState<any[]>();
  const { data: run, isFetching } = useQuery({
    queryKey: ["getRunById"],
    queryFn: () => getRunById(Number(id)),
  });
  if (isFetching || !run) return;

  const fileUpload = (formData: FormData) => {
    const formObject = Object.fromEntries(formData.entries());
    const reader = new FileReader();

    reader.onload = function (e: any) {
      const content = e.target.result;
      setUploadData(parseCsv(content));   
    };
    reader.readAsText(formObject['myFile'] as Blob);
  };

  const headers = [
    { name: 'name', header: 'Name'},
    { name: 'time', header: 'Time'},
    { name: 'rank', header: 'Rank'}
  ]

  return (
    <div>
      Run {run.title} {run.distance} km Upload results
      <FileUploader onUploadFile={fileUpload} />

      {uploadData && uploadData.length > 0 && <Table
        headers={headers}
        data={uploadData}
        totalRows={uploadData.length}
      />}
    </div>
  );
}
