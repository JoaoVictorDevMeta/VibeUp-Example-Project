import { Avatar, Flex, Text, Box } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import getUserState from "../utils/getUserState";
import { BsCheck2All } from "react-icons/bs";

const Message = ({ ownMessage, message }) => {
  const [selectedConversation, _] = useAtom(selectedConversationAtom);
  const user = getUserState();

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"} p={1}>
          <Flex bg={"blue.800"} maxW={"350px"} p={1} borderRadius={"md"}>
            <Text color={"white"}>{message.text}</Text>
            <Box
              alignSelf={"flex-end"}
              ml={1}
              color={message.seen ? "blue.400" : ""}
              fontWeight={"bold"}
            >
              <BsCheck2All size={16} />
            </Box>
          </Flex>
          <Avatar src={user.profilePic} w="7" h="7"></Avatar>
        </Flex>
      ) : (
        <Flex gap={2} p={1}>
          <Avatar
            src={selectedConversation.userProfilePic}
            w="7"
            h="7"
          ></Avatar>
          <Text
            maxW={"350px"}
            bg={"gray.400"}
            p={1}
            px={3}
            borderRadius={"md"}
            color={"black"}
            marginEnd={5}
          >
            {message.text}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;
