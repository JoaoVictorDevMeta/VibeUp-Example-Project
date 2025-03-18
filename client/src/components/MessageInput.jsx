import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { IoSendSharp } from "react-icons/io5";
import React, { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { selectedConversationAtom, chatsAtom } from "../atoms/messagesAtom";
import { useAtom } from "jotai";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const [selectedConversation, _] = useAtom(selectedConversationAtom);
  const setChats = useAtom(chatsAtom)[1];
  const showToast = useShowToast();

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: messageText,
          recipientId: selectedConversation.userId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Erro", data.error, "error");
        return;
      }
      setMessages((prev) => [...prev, data]);
      setChats((prevChats) => {
        const updatedChat = prevChats.map((chat) => {
          if (chat.id === selectedConversation.id) {
            return { ...chat, messages: [data] };
          }
          return chat;
        })
        return updatedChat;
      });

      setMessageText("");
    } catch (error) {
      showToast("Erro", error.message, "error");
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input
          w={"full"}
          placeholder="Digite sua mensagem"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
        ></Input>
        <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
          <IoSendSharp color={"green.500"} />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
