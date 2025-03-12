import {
  Avatar,
  Flex,
  Image,
  Text,
  Box,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import getUserState from "../utils/getUserState";
import { DeleteIcon } from "@chakra-ui/icons";
import { useAtom } from "jotai";
import { postAtom } from "../atoms/postAtom";

const PostPage = () => {
  const showToast = useShowToast();
  const currentUser = getUserState();
  const { pid } = useParams();
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useAtom(postAtom);
  const [loadingPost, setLoadingPost] = useState(true);
  const navigate = useNavigate();
  const post = posts[0]

  useEffect(() => {
    const getPost = async () => {
      try {
        setPosts([]);
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Erro", data.error, "error");
          return;
        }
        setPosts([data]);
      } catch (error) {
        showToast("Erro", error, "error");
      } finally {
        setLoadingPost(false);
      }
    };
    getPost();
  }, [pid, showToast ,setPosts]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();

      if (!window.confirm("Tem certeza que deseja deletar esse post?")) return;

      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Erro", data.error, "error");
        return;
      }
      showToast("Sucesso", "Post deletado com sucesso", "success");
      setPosts(posts.filter((p) => p.id !== post.id));
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Erro", error, "error");
    }
  };

  if ((!user && loading) || loadingPost) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!post) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name={user.username} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.name}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"end"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(post.createdAt), { locale: ptBR })}
          </Text>
          {currentUser?.id === user.id && (
            <DeleteIcon size={20} onClick={handleDeletePost} />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{post.text}</Text>

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

      <Flex gap={3} my={3}>
        <Actions post={post} />
      </Flex>

      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>
            Baixe o app para participar desta comunidade
          </Text>
        </Flex>
        <Button>Baixar</Button>
      </Flex>
      <Divider my={4} />

      {post.replies.map((reply) => (
        <Comment
          key={reply.id}
          reply={reply}
          lastReply={reply.id === post.replies[post.replies.length - 1].id}
        />
      ))}
    </>
  );
};

export default PostPage;
