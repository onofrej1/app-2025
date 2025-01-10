"use client";
import { useQuery } from "@tanstack/react-query";

const fechSession = async () => {
  const res = await fetch("/api/session");
  return res.json();
};

export function useSession() {
  const { data: session, isFetching } = useQuery({
    queryKey: ["getSession"],
    queryFn: fechSession,
  });
  return {
    isFetching,
    user: {
      user: session?.user,
      //userId: session?.userId,
      role: session?.role,
    },
  };
}
