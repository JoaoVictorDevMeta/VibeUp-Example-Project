import { WrapItem } from "@chakra-ui/layout";
import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import getUserState from "../utils/getUserState";
import { BsCheck2All } from "react-icons/bs";
import { useAtom } from "jotai";
import { selectedConversationAtom } from "../atoms/messagesAtom";

const Conversation = ({chat}) => {
  const user = chat.participants[0].user;
  const currentUser = getUserState();
  const lastMessage = chat.messages[0];
  const [selectedConversation, setSelectedConversation] = useAtom(selectedConversationAtom);
  const colorMode =  useColorMode().colorMode;

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
      onClick={() => setSelectedConversation({
        id: chat.id,
        userId: user.id,
        username: user.name,
        userProfilePic: user.profilePic
      })}
      bg={selectedConversation?.id === chat.id ? (colorMode === "light" ? "gray.600" : "gray.dark") : ""}
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
          <AvatarBadge boxSize={"1em"} bg={"green.500"} />
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {user.name} <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {lastMessage.senderId === currentUser.id ? <BsCheck2All size={16}/> : ""}
          {lastMessage.text.length > 18 
            ? `${lastMessage.text.substring(0, 18)}...`
            : lastMessage.text}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;
