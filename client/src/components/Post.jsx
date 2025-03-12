import { Link, useNavigate } from "react-router-dom";
import { Flex, Avatar, Box, Image, Text } from "@chakra-ui/react";
import Actions from "./Actions";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DeleteIcon } from "@chakra-ui/icons";
import getUserState from "../utils/getUserState";
import useShowToast from "../hooks/useShowToast";
import { useAtom } from "jotai";
import { postAtom } from "../atoms/postAtom";

const Post = ({ post, postedBy }) => {
  const navigate = useNavigate();
  const showToast = useShowToast();
  const currentUser = getUserState();
  const [posts, setPosts] = useAtom(postAtom);

  const handleDeletePost = async (e) => {
    try{
      e.preventDefault();

      if(!window.confirm("Tem certeza que deseja deletar esse post?")) return;

      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await res.json();
      if(data.error){
        showToast("Erro", data.error, "error");
        return;
      }
      showToast("Sucesso", "Post deletado com sucesso", "success");
      setPosts(posts.filter(p => p.id !== post.id));
    }catch(error){
      showToast("Erro", error, "error");
    }
  }

  return (
    <Link to={`/${postedBy.username}/post/${post.id}`}>
      <Flex gap={3} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size={{
              base: "sm",
              sm: "md",
            }}
            name={postedBy.name}
            src={postedBy.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${postedBy.username}`);
            }}
          />
          <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {post.replies[0] && (
              <Avatar
                size="xs"
                name={post.replies[0].PostedBy.name}
                src={post.replies[0].PostedBy.profilePic}
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
              />
            )}
            {post.replies[1] && (
              <Avatar
                size="xs"
                name={post.replies[1].PostedBy.name}
                src={post.replies[1].PostedBy.profilePic}
                position={"absolute"}
                bottom={"0px"}
                right={"-5px"}
                padding={"2px"}
              />
            )}
            {post.replies[2] && (
              <Avatar
                size="xs"
                name={post.replies[2].PostedBy.name}
                src={post.replies[2].PostedBy.profilePic}
                position={"absolute"}
                bottom={"0px"}
                left={"4px"}
                padding={"2px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${postedBy.username}`);
                }}
              >
                {postedBy.name}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"xs"} width={36} textAlign={"end"} color={"gray.light"}>
                {formatDistanceToNow(new Date(post.createdAt), {
                  locale: ptBR,
                })}
              </Text>
              {currentUser?.id === postedBy.id && <DeleteIcon size={20} onClick={handleDeletePost}/>}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post.img} w={"full"} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
          
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
