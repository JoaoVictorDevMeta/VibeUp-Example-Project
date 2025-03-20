import { WrapItem } from "@chakra-ui/layout";
import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  useColorMode,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import getUserState from "../utils/getUserState";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { useAtom } from "jotai";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({ chat, isOnline }) => {
  const user = chat.participants[0].user;
  const currentUser = getUserState();
  const lastMessage = chat.messages[0];
  const [selectedConversation, setSelectedConversation] = useAtom(
    selectedConversationAtom
  );
  const colorMode = useColorMode().colorMode;

  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      onClick={() =>
        setSelectedConversation({
          id: chat.id,
          userId: user.id,
          username: user.username,
          userProfilePic: user.profilePic,
          mock: chat.mock,
        })
      }
      bg={
        selectedConversation?.id === chat.id
          ? colorMode === "light"
            ? "gray.600"
            : "gray.dark"
          : ""
      }
      borderRadius={"md"}
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={user.profilePic}
        >
          {isOnline ? <AvatarBadge boxSize="1em" bg="green.500" /> : ""}
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {user.username} <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {lastMessage.senderId === currentUser.id ? (
            <Box
              alignSelf={"flex-end"}
              ml={1}
              color={lastMessage.seen ? "blue.400" : ""}
              fontWeight={"bold"}
            >
              <BsCheck2All size={16} />
            </Box>
          ) : (
            ""
          )}

          {lastMessage.text.length > 18
            ? `${lastMessage.text.substring(0, 18)}...`
            : lastMessage.text || <BsFillImageFill size={16}/>}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;
