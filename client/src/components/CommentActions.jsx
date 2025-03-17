import {
  Button,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverHeader,
  Portal,
  Text,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import { useAtom } from "jotai";
import { postAtom } from "../atoms/postAtom";

const CommentActions = ({ replyId }) => {
  const showToast = useShowToast();
  const [posts, setPosts] = useAtom(postAtom);

  const handleDeleteReply = async () => {
    try {
      const res = await fetch(`/api/posts/reply/${replyId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Erro", data.error, "error");
        return;
      }

      const updatedPosts = posts.map((post) => {
        const updatedReplies = post.replies.filter(
          (reply) => reply.id !== replyId
        );
        return { ...post, replies: updatedReplies };
      });
      setPosts(updatedPosts);
      
      showToast("Sucesso", "Resposta deletada com sucesso", "success");
    } catch (error) {
      showToast("Erro", error, "error");
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <BsThreeDots cursor={"pointer"} />
        </PopoverTrigger>
        <Portal>
          <PopoverContent
            bg={useColorModeValue("white", "gray.dark")}
            boxShadow="none"
            w="200px"
          >
            <PopoverArrow />
            <PopoverBody>
              <Flex gap={2}>
                <Button onClick={handleDeleteReply}>Deletar</Button>
                <Button>Editar</Button>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  );
};

export default CommentActions;
