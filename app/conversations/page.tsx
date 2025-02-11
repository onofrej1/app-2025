"use client";
import { getConversations } from "@/actions/social";
import Chat from "@/components/chat/chat";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

export default function Conversations() {
  const [conversationId, setConversationId] = useState<number>();
  const { data: conversations = [], isFetching } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    refetchOnWindowFocus: false,
  });
  if (isFetching) return null;
  //console.log(conversations);

  return (
    <div>
      <div className="flex h-[calc(100vh-120px)]">
        <div className="bg-slate-200 h-full p-3">
          {conversations.map((conversation) => {
            return (
              <div key={conversation.id} className="mb-1">
                <Button variant="ghost" onClick={() => setConversationId(conversation.conversation.id)}>
                  {conversation.user.firstName} - {conversation.user.email}
                </Button>
                <div className="pl-4">
                  <small>{conversation.conversation.lastMessage?.content}</small>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex-1 bg-green-200">
          {conversationId && <Chat conversationId={conversationId} />}
        </div>
      </div>
    </div>
  );
}
