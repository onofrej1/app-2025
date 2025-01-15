"use client";
import { getActivity } from "@/actions/activities";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

export default function ActivityPage() {
  const id = 3;
  const { data: activity, isFetching } = useQuery({
    queryKey: ["getActivity", id],
    queryFn: () => getActivity(id),
    select: (data) => {
      const items = data.activityData.map((e) => ({
        id: e.id.toString(),
        elevation: Number(e.elevation),
        time: new Date(e.time),
        color: "pink" as const,
      }));
      return { activity: data, data: items };
    },
  });
  if (isFetching) return;
  console.log(activity);

  return (
    <div>
      Elevation
      <LineChart width={500} height={300} data={activity?.data}>
        <XAxis dataKey="time" />
        <YAxis dataKey="ele"/>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="elevation" stroke="#8884d8" />
        {/*<Line type="monotone" dataKey="pv" stroke="#82ca9d" />*/}
      </LineChart>
    </div>
  );
}
