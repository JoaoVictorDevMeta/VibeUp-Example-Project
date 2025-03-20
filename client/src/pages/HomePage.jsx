import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import { useAtom } from "jotai";
import { postAtom } from "../atoms/postAtom";
import CreatePostBox from "../components/CreatePostBox";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useAtom(postAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeedPosts = async () => {
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Erro", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Erro", error, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex gap={10}>
      <Box flex={70}>
        <CreatePostBox />
        {loading && (
          <Flex justifyContent={"center"}>
            <Spinner size={"xl"} />
          </Flex>
        )}
        {!loading && posts.length === 0 && (
          <h1>Começe a seguir usuários para que seus posts apareçam aqui</h1>
        )}
        {!loading &&
          posts.map((post) => (
            <Post key={post.id} post={post} postedBy={post.PostedBy} />
          ))}
      </Box>
      <Box flex={30}>
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
