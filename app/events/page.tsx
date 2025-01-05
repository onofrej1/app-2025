"use client";
import { getEvents } from "@/actions/events";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

export default function Events() {
  const { data: events, isFetching } = useQuery({
    queryKey: ["getEvents"],
    queryFn: getEvents,
  });
  if (isFetching) return;
  //console.log(events);

  return (
    <div>
      {events?.map((event) => {
        return (
          <div key={event.id} className="space-y-4">
            {event.name} {formatDate(event.startDate)}
            <Link href={`/events/${event.id}`}>
                <Button size={'sm'}>More</Button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
