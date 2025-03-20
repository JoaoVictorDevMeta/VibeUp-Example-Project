import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

const SuggestedUsers = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (data.error) {
          showToast("Erro", data.error, "error");
          return;
        }
        setSuggestedUsers(data);
      } catch (error) {
        showToast("Erro", error, "error");
      } finally {
        setLoading(false);
      }
    };
    getSuggestedUsers();
  }, [showToast]);

  return (
    <>
      <Text mb={4} fontWeight={"bold"}>
        Talvez você conheça
      </Text>
      <Flex direction={"column"} gap={4}>
        {!loading &&
          suggestedUsers.map((user) => (
            <SuggestedUser key={user.id} user={user} />
          ))}
        {loading &&
          [...Array(5)].map((_, index) => (
            <Flex
              key={index}
              alignItems={"center"}
              gap={2}
              p={1}
              borderRadius={"md"}
            >
              <Box>
                <SkeletonCircle size={"10"} />
              </Box>
              <Flex w={"full"} flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"80px"}></Skeleton>
                <Skeleton h={"8px"} w={"90px"}></Skeleton>
              </Flex>
              <Flex>
                <Skeleton h={"20px"} w={"60px"}></Skeleton>
              </Flex>
            </Flex>
          ))}
      </Flex>
    </>
  );
};

export default SuggestedUsers;
