"use client";
import { createMessage, getMessages } from "@/actions/social";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import Form, { FormRender } from "../form/form";
import { Button } from "../ui/button";
import { cn } from "@/utils";
import { useSession } from "next-auth/react";
import io from "socket.io-client";

const socketIO = io("http://localhost:3000");

interface ChatProps {
  conversationId: number;
}

export default function Chat(props: ChatProps) {
  const { conversationId } = props;
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const { data: messages = [], isFetching } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessages(conversationId),
  });

  useEffect(() => {
    socketIO.on("connect", function () {
      console.log("Connected to WebSocket server");
      socketIO.emit("join-conversation", conversationId);
    });

    socketIO.on("message-received", (message) => {
      // Handle incoming message
      console.log("Received message:", message);
      //queryClient.invalidateQueries({ queryKey: ["messages", conversationId]});
    });

    socketIO.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socketIO.off("connect");
      socketIO.off("disconnect");
      socketIO.off("message-received");
    };
  }, []);

  if (isFetching) return null;
  console.log(session);

  const handleMessageSend = async (data: any) => {
    console.log(data);
    await createMessage(conversationId, data.message);
    socketIO.emit("message", conversationId);
    queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
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

  console.log("conversation id", conversationId);
  console.log(messages);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-red-200">
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender.id === session?.user.id && "justify-end"
              )}
            >
              {message.sender.name} -{message.content}
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
