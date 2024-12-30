"use client";
import { getConversations } from "@/actions/social";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Conversations() {
  const { data: conversations = [], isFetching } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
  if (isFetching) return null;
  console.log("conversations");
  console.log(conversations);

  return (
    <div>
      <div className="flex h-screen">
        <div className="bg-slate-200 h-full p-3">
          {conversations.map((conversation) => {
            return (
              <div key={conversation.id}>
                {conversation.user.name} - {conversation.user.email}
              </div>
            );
          })}
        </div>
        <div className="flex flex-1 h-full p-4">Chat</div>
      </div>
    </div>
  );
}
