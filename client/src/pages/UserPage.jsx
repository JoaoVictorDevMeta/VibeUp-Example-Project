import { useState, useEffect } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
//global state
import { useAtom } from "jotai";
import { postAtom } from "../atoms/postAtom";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [loadingPosts, setLoadingPosts] = useState(true);
  //global state setup
  const [posts, setPosts] = useAtom(postAtom);
  
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Erro", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Erro", error, "error");
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    }

    getPosts();

  }, [username, showToast, setPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>Usuário não econtrado</h1>;

  return (
    <>
      <UserHeader user={user} />
      
      {loadingPosts && (
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {!loadingPosts && posts.length === 0 && <h1>Este usuário não possui posts</h1>}
      {posts.map((post) => (
        <Post key={post.id} post={post} postedBy={user}/>
      ))}
    </>
  );
};

export default UserPage;
