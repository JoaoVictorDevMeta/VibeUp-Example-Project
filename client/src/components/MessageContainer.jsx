import { Divider } from "@chakra-ui/layout";
import {
  Avatar,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useAtom } from "jotai";
import { chatsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import getUserState from "../utils/getUserState";
import { useSocket } from "../hooks/useSocket";

const MessageContainer = () => {
  const showToast = useShowToast();
  const [selectedConversation, _] = useAtom(selectedConversationAtom);
  const [__, setChats] = useAtom(chatsAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const user = getUserState();
  const { socket } = useSocket();
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      console.log(message)
      if (selectedConversation.id === message.chatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }

      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat.id === message.chatId) {
            return {
              ...chat,
              messages: [message],
            };
          }
          return chat;
        });
        return updatedChats;
      });
    });
    return () => socket.off("newMessage");
  }, [socket, setChats, selectedConversation]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length && messages[messages.length -1].senderId !== user.id;

    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation.id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
			if (selectedConversation.id === conversationId) {
				setMessages((prev) => {
					const updatedMessages = prev.map((message) => {
            console.log(message);
						if (!message.seen) {
							return {
								...message,
								seen: true,
							};
						}
						return message;
					});
					return updatedMessages;
				});
			}
		});

  }, [socket, messages, selectedConversation, user.id]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      try {
        if (selectedConversation?.mock) return;
        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Erro", data.error, "error");
        }
        setMessages(data);
      } catch (err) {
        showToast("Erro", err.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [showToast, selectedConversation.userId, selectedConversation?.mock]);

  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      p={2}
      flexDirection={"column"}
    >
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"}></Avatar>
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation.username}{" "}
          <Image src="/verified.svg" w={4} h={4} ml={1} />
        </Text>
      </Flex>
      <Divider />

      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        height={"360px"}
        overflowY={"scroll"}
        p={2}
      >
        {loadingMessages &&
          [...Array(5)].map((_, index) => (
            <Flex
              key={index}
              alignItems={"center"}
              gap={2}
              p={1}
              borderRadius={"md"}
              alignSelf={index % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {index % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
                <Skeleton h={"8px"} w={"250px"} />
              </Flex>
              {index % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}

        {!loadingMessages && messages.length
          ? messages.map((message) => (
              <Flex
                key={message.id}
                direction={"column"}
                ref={
                  messages.length - 1 === messages.indexOf(message)
                    ? messageEndRef
                    : null
                }
              >
                <Message
                  ownMessage={message.senderId === user.id}
                  message={message}
                />
              </Flex>
            ))
          : null}
      </Flex>
      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
