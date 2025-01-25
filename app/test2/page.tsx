"use client";
import { getCategories } from "@/actions/tasks";
import { Category } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import { useInView } from "react-intersection-observer";

const rowsToFetch = 10;

export default function UserList() {
  const [isPending, startTransition] = useTransition();
  const [offset, setOffset] = useState(rowsToFetch);
  const [data, setData] = useState<Category[]>([]);
  const { ref, inView } = useInView({ threshold: 0.5 });

  const loadMoreUsers = async () => {
    startTransition(async () => {
      const newData = await getCategories(offset, rowsToFetch);
      setData((rows) => [...rows, ...newData]);
      setOffset((offset) => offset + rowsToFetch);
    });
  };

  useEffect(() => {
    if (!isPending && inView) {
      console.log('load data');
      loadMoreUsers();
    }
  }, [inView, isPending]);

  return (
    <div className="flex flex-col gap-3">
      {data.map((row) => (
        <div className="pb-3" key={row.id}>{row.title}</div>
      ))}
      {!isPending && <div ref={ref}>Loading...</div>}
      {/* <button onClick={loadMoreUsers}>Load more</button> */}
    </div>
  );
}
