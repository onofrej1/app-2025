"use client";
import { createMessage, getMessages } from "@/actions/social";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import Form, { FormRender } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { socket } from "@/socket";
import { useSession } from "@/hooks/use-session";

interface ChatProps {
  conversationId: number;
}

export default function Chat(props: ChatProps) {
  const { conversationId } = props;
  const { isFetching: isSessionLoading, user, userId } = useSession();
  const queryClient = useQueryClient();
  const { data: messages = [], isFetching } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log("Connected to WebSocket server");
      socket.emit("join-chat", conversationId);
    }

    socket.on("connect", onConnect);

    socket.on("message", (message) => {
      console.log("Received message:", message);
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId]});
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, []);

  if (isFetching) return null;

  const handleMessageSend = async (data: any) => {
    await createMessage(conversationId, data.message);
    queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    socket.emit("message", conversationId);    
  };

  const renderForm: FormRender = ({ fields }) => {
    return (
      <div className="flex justify-between">
        {fields.message}
        <Button type="submit">Send message</Button>
      </div>
    );
  };

  const fields = [{ name: "message", type: "text", label: "" }];  

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-red-200 max-h-[600px] overflow-scroll">
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender.id === userId && "justify-end"
              )}
            >
              {message.sender.lastName} {message.sender.firstName} - {message.content}
            </div>
          );
        })}
      </div>
      <div className="">
        <Form
          fields={fields}
          action={handleMessageSend}
          validation="SendMessage"
          render={renderForm}
        />
      </div>
    </div>
  );
}
