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
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useAtom } from "jotai";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import getUserState from "../utils/getUserState";

const MessageContainer = () => {
  const showToast = useShowToast();
  const [selectedConversation, _] = useAtom(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const user = getUserState();

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      try {
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
  }, [showToast, selectedConversation.userId]);

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
          {selectedConversation.username} <Image src="/verified.svg" w={4} h={4} ml={1} />
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

          {!loadingMessages && messages.map((message) => (
            <Message key={message.id} ownMessage={message.senderId === user.id} message={message}/>
          ))}
      </Flex>
      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
