import { Avatar, Flex, Text } from "@chakra-ui/react";

const Message = ({ ownMessage }) => {
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"} p={1}>
          <Text maxW={"350px"} bg={"blue.400"} p={1} borderRadius={"md"}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. d
            aliqua. Ut enim ad minim veniam
          </Text>
          <Avatar src="" w="7" h="7"></Avatar>
        </Flex>
      ) : (
        <Flex gap={2} p={1}>
          <Avatar src="" w="7" h="7"></Avatar>
          <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. d
            aliqua. Ut enim ad minim veniam,
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;
