import { useState } from "react";
import useShowToast from "./useShowToast";
import getUserState from "../utils/getUserState";

const useFollowUnfollow = (user) => {
  const currentUser = getUserState();
  const [following, setFollowing] = useState(
    user.followers.some((follower) => follower.followingId === currentUser?.id)
  );
  const [ updating, setUpdating ] = useState(false);
  const showToast = useShowToast();

  const handleFollowUnfollow = async () => {
    try {
      setUpdating(true);
      if (updating) return;
      const res = await fetch(`/api/users/follow/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Erro", data.error, "error");
        return;
      }
      if (following) {
        showToast("Sucesso", `Deixou de seguir ${user.username}`, "success");
        user.followers = user.followers.filter(
          (follower) => follower.followingId !== currentUser?.id
        );
      } else {
        showToast("Sucesso", `Seguindo ${user.username}`, "success");
        user.followers.push({
          followingId: currentUser?.id,
          followerId: user.id,
        });
      }
      setFollowing(!following);
    } catch (error) {
      console.log(error);
      showToast("Erro", "Erro ao seguir usuário", "error");
    } finally {
      setUpdating(false);
    }
  };

  return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
