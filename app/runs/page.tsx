"use client";
import { getRuns } from "@/actions/runs";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

export default function Events() {
  const { data: runs = [], isFetching } = useQuery({
    queryKey: ["getRuns"],
    queryFn: getRuns,
  });
  if (isFetching) return;
  console.log(runs);

  return (
    <div>
      {runs.map((run) => {
        return (
          <div key={run.id} className="space-y-4">
            {run.title} {formatDate(run.event.startDate)}
            <div>Participants: {run._count.registrations}</div>
            {run._count.runResults > 0 && (
              <div>
                <Link href={`runs/${run.id}/results`}>Vysledky </Link>
              </div>
            )}
            <Link href={`/runs/${run.id}`}>
              <Button size={"sm"}>More</Button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
