import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const conversations = {};

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("join-conversation", (conversationId) => {
      console.log("join-conversation:", conversationId);
      socket.join('conversation_'+conversationId);
      /*if (!conversations[conversationId]) {
        console.log('add socket room');
        conversations[conversationId] = conversationId;
        socket.rooms.add('conversation:'+conversationId);
      }*/
      //socket.to('conversation:'+conversationId).emit('message-received');
    });

    socket.on("message", (conversationId) => {
      console.log("get message:", conversationId);

      socket.to('conversation_'+conversationId).emit('message-received');
    });
    // ...
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});