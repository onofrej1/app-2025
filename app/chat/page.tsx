'use client'
import { ChangeEvent, useEffect, useState } from "react";
import io from "socket.io-client";

let socket: any;

export default function Home() {    
  const [input, setInput] = useState("");
  

  useEffect(() => {
    socket = io('http://localhost:3000');

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("update-input", (msg: string) => {
      console.log('received from server', msg);
      //setInput(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    socket.emit("input-change", e.target.value);
  };

  return (
    <div>
      WebSocket Test Page
      <input
        placeholder="Type something"
        value={input}
        onChange={onChangeHandler}
      />
    </div>
  );
}
