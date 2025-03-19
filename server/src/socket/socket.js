import { Server } from "socket.io";
import http from "http";
import express from "express";
import prisma from '../../prisma/database.js'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

export const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId != "undefined") {
    userSocketMap[userId] = socket.id;
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("markMessagesAsSeen", async({ conversationId, userId }) => {
    try{
      await prisma.message.updateMany({
        where: {
          chatId: conversationId,
          seen: false
        },
        data: {
          seen: true
        }
      })
      io.to(userSocketMap[userId]).emit("messagesSeen", {conversationId});
    }catch(err){
      console.log(err);
    }
  })

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { server, io, app };
