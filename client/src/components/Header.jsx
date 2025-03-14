import { Image, Flex, useColorMode, Button } from "@chakra-ui/react";
import getUserState from "../utils/getUserState";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import { useAtom } from "jotai";
import { authScreenAtom } from "../atoms/authScreenAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const setAuthScreen = useAtom(authScreenAtom)[1];
  const user = getUserState();
  const logout = useLogout();

  return (
    <Flex justifyContent={"space-between"} mt={6} mb="12">
      {user && (
        <RouterLink to={`/`}>
          <AiFillHome size={24} />
        </RouterLink>
      )}
      {!user && (
        <RouterLink to={`/auth`} onClick={() => setAuthScreen("login")}>
          Login
        </RouterLink>
      )}
      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {user && (
        <Flex alignItems={"center"} gap={4}>
          <RouterLink to={`/${user.username}`}>
            <RxAvatar size={24} />
          </RouterLink>
          <RouterLink to={`/chat`}>
            <BsFillChatQuoteFill size={20} />
          </RouterLink>
          <Button size="xs" onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}
      {!user && (
        <RouterLink to={`/auth`} onClick={() => setAuthScreen("register")}>
          Cadastro
        </RouterLink>
      )}
    </Flex>
  );
};

export default Header;
