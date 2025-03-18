import { Avatar, Flex, Text } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import getUserState from "../utils/getUserState";

const Message = ({ ownMessage, message }) => {
  const [ selectedConversation, _ ] = useAtom(selectedConversationAtom);
  const user = getUserState(); 

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"} p={1}>
          <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"} marginStart={5}>
            {message.text}
          </Text>
          <Avatar src={user.profilePic} w="7" h="7"></Avatar>
        </Flex>
      ) : (
        <Flex gap={2} p={1}>
          <Avatar src={selectedConversation.userProfilePic} w="7" h="7"></Avatar>
          <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"} marginEnd={5}>
            {message.text}
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;
