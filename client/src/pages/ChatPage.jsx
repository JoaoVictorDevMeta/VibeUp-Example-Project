import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useAtom } from "jotai";
import { chatsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import getUserState from "../utils/getUserState";
import { useSocket } from "../hooks/useSocket";

const ChatPage = () => {
  const [loadingChats, setLoadingChats] = useState(true);
  const [chats, setChats] = useAtom(chatsAtom);
  const [selectedConversation, setSelectedConversation] = useAtom(
    selectedConversationAtom
  );
  const [searchText, setSearchText] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const user = getUserState();
  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat.id === conversationId) {
            return {
              ...chat,
              messages: chat.messages.map((message) => ({
                ...message,
                seen: true,
              })),
            };
          }
          return chat;
        });
        return updatedChats;
      });
    });
  }, [socket, setChats]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await fetch("/api/messages/conversation");
        const data = await res.json();
        if (data.error) {
          showToast("Erro", data.error, "error");
        }
        setChats(data);
      } catch (err) {
        showToast("Erro", err.message, "error");
      } finally {
        setLoadingChats(false);
      }
    };
    getConversation();
  }, [showToast, setChats]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      if (!searchText) return;
      if (searchText === user.username) {
        showToast(
          "Erro",
          "Você não pode mandar mensagem para você mesmo",
          "error"
        );
        return;
      }

      const res = await fetch(`/api/users/profile/${searchText}`);
      const data = await res.json();

      if (data.error) {
        showToast("Erro", data.error, "error");
        return;
      }

      const existingChat = chats.find(
        (chat) => chat.participants[0].user.id === data.id
      );
      if (existingChat) {
        setSelectedConversation({
          id: existingChat.id,
          userId: data.id,
          username: data.username,
          userProfilePic: data.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        messages: [
          {
            text: "",
            sender: "",
          },
        ],
        participants: [
          {
            user: {
              id: data.id,
              username: data.username,
              profilePic: data.profilePic,
            },
          },
        ],
        id: Date.now(),
      };

      setChats((prev) => [...prev, mockConversation]);
    } catch (err) {
      showToast("Erro", err.message, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      transform={"translateX(-50%)"}
      w={{
        lg: "750px",
        md: "80%",
        base: "100%",
      }}
      p={4}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxWidth={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{ sm: "250px", md: "full" }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Suas conversas
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Procurar usuário"
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
              ></Input>
              <Button size={"sm"} type="submit" isLoading={searchingUser}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loadingChats &&
            [0, 1, 2, 3, 4].map((_, index) => (
              <Flex
                key={index}
                alignItems={"center"}
                gap={4}
                p={1}
                borderRadius={5}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!loadingChats &&
            chats.map((chat) => (
              <Conversation
                key={chat.id}
                isOnline={onlineUsers.includes(
                  chat.participants[0].user.id.toString()
                )}
                chat={chat}
              />
            ))}
        </Flex>
        {!selectedConversation.id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text>Selecione uma conversa para mandar mensagem</Text>
          </Flex>
        )}

        {selectedConversation.id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
