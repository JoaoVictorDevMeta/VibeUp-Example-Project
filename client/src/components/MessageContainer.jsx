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

const MessageContainer = () => {
  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      p={2}
      flexDirection={"column"}
    >
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src="" size={"sm"}></Avatar>
        <Text display={"flex"} alignItems={"center"}>
          joaovictor <Image src="/verified.svg" w={4} h={4} ml={1} />
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
        {false &&
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

          <Message ownMessage={false}/>
          <Message ownMessage={false}/>
          <Message ownMessage={true}/>
          <Message ownMessage={false}/>
      </Flex>
      <MessageInput/>
    </Flex>
  );
};

export default MessageContainer;
