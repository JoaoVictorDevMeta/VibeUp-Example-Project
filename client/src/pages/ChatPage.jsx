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

const ChatPage = () => {
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
          <form>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Procurar usuário"></Input>
              <Button size={"sm"}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {false &&
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

          <Conversation />
          <Conversation />
          <Conversation />
          <Conversation />
        </Flex>
        {/*<Flex
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
        </Flex>*/}
        
        <MessageContainer/>
      </Flex>
    </Box>
  );
};

export default ChatPage;
