import { Avatar, Flex, Text, Box, Image, Skeleton } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import getUserState from "../utils/getUserState";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";

const Message = ({ ownMessage, message }) => {
  const [selectedConversation, _] = useAtom(selectedConversationAtom);
  const user = getUserState();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"} p={1}>
          {message.text && (
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
          )}
          {message.img && !imageLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImageLoaded(true)}
                alt="Message image"
                borderRadius={4}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}
          {message.img && imageLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="Message image" borderRadius={4} />
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}
          <Avatar src={user.profilePic} w="7" h="7"></Avatar>
        </Flex>
      ) : (
        <Flex gap={2} p={1}>
          <Avatar
            src={selectedConversation.userProfilePic}
            w="7"
            h="7"
          ></Avatar>
          {message.text && (
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
          )}
          {message.img && !imageLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImageLoaded(true)}
                alt="Message image"
                borderRadius={4}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}
          {message.img && imageLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="Message image" borderRadius={4} />
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};

export default Message;
