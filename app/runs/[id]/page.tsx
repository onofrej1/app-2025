"use client";
import { getRunById } from "@/actions/runs";
import FileUploader from "@/components/form/fileUpload";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Table from "@/components/table/table";
import { hmsToSeconds, parseCsv } from "@/lib/utils";
import { createResults } from "@/actions/results";
import { Button } from "@/components/ui/button";

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
      const requiredHeaders = ['rank', 'bib', 'name', 'category', 'time', 'club', 'gender', 'yearOfBirth'];
      const csvData = parseCsv(content, requiredHeaders);
      setUploadData(csvData);   
    };
    reader.readAsText(formObject['myFile'] as Blob);
  };

  const headers = [
    { name: 'name', header: 'Name'},
    { name: 'time', header: 'Time'},
    { name: 'rank', header: 'Rank'}
  ];
  
  const saveResults = () => {
    if (uploadData && uploadData?.length > 0) {
      const data = uploadData.map(d => {
        d.runId = id;
        d.time = hmsToSeconds(d.time);
        return d;        
      });
      createResults(data);
    }    
  }

  return (
    <div>
      Run {run.title} {run.distance} km Upload results
      <FileUploader onUploadFile={fileUpload} />

      {uploadData && uploadData.length > 0 && <Table
        headers={headers}
        data={uploadData}
        totalRows={uploadData.length}
      />}
      <Button onClick={saveResults}>Save results</Button>
    </div>
  );
}
