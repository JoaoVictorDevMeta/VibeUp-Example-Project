import prisma from "../../prisma/database.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";

async function sendMessage(req, res) {
  try {
    const { recipientId } = req.body;
    let {img, text} = req.body;
    const senderId = req.user.id;

    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: senderId } } },
          { participants: { some: { userId: recipientId } } },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({});
      await prisma.conversationParticipant.createMany({
        data: [
          {
            userId: senderId,
            conversationId: conversation.id,
          },
          {
            userId: recipientId,
            conversationId: conversation.id,
          },
        ],
      });
    }

    if(img){
      const uploadedImg = await cloudinary.uploader.upload(img);
      img = uploadedImg.secure_url;
      text = "";
    }

    const newMessage = await prisma.message.create({
      data: {
        text,
        img: img || "",
        conversation: {
          connect: {
            id: conversation.id,
          },
        },
        sender: {
          connect: {
            id: senderId,
          },
        },
      },
    });

    const recipientSocketId = getRecipientSocketId(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }

    // code to send message
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getMessages(req, res) {
  const otherUserId = req.params.userId;
  const userId = req.user.id;
  try {
    if (!otherUserId || Number(otherUserId) === userId) {
      return res.status(400).json({ error: "requisição inválida" });
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: Number(otherUserId) } } },
        ],
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!conversation) {
      return res.status(404).json({ error: "Nenhuma conversa encontrada" });
    }
    res.status(200).json(conversation.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getConversations(req, res) {
  const userId = req.user.id;
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: {
        participants: {
          where: {
            userId: {
              not: userId,
            },
          },
          select: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                profilePic: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { sendMessage, getMessages, getConversations };
