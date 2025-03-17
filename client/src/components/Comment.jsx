import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import Actions from "./Actions";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import CommentActions from "./CommentActions";
import getUserState from "../utils/getUserState";

const Comment = ({ reply, lastReply }) => {
  const user = getUserState();

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.PostedBy.profilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {reply.PostedBy.name}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                {formatDistanceToNow(new Date(reply.createdAt), {
                  locale: ptBR,
                })}
              </Text>
              {user.id === reply.PostedBy.id && <CommentActions replyId={reply.id}/>}
            </Flex>
          </Flex>
          <Text>{reply.text}</Text>
          {/*<Actions liked={liked} setLiked={setLiked} />*/}
          <Text fontSize={"sm"} color={"gray.light"}>
            {10} likes
          </Text>
        </Flex>
      </Flex>

      {!lastReply && <Divider my={4} />}
    </>
  );
};

export default Comment;
