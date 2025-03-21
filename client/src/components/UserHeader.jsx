import {
  VStack,
  Box,
  Flex,
  Text,
  Link,
  Portal,
  useToast,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
//icons
import { BsGithub } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Link as RouterLink } from "react-router-dom";
import getUserState from "../utils/getUserState";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);
  const currentUser = getUserState();

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Link Copiado",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    });
  };


  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user.username}</Text>
            <Text fontSize={"sm"} bg={"gray.dark"} color={"gray.light"}>
              vibeup.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user?.profilePic ? (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          ) : (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>

      {currentUser?.id === user.id && (
        <RouterLink to="/update">
          <Button size="sm">Editar Perfil</Button>
        </RouterLink>
      )}
      {currentUser?.id !== user.id && (
        <Button size="sm" onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Deixar de seguir" : "Seguir"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} seguidores</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>github.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsGithub size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copiar Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Vibes</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1.5px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Repostagens</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
