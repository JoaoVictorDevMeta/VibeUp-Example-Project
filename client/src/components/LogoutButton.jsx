import { Button, useToast } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
  const toast = useToast();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        toast({
          title: "Erro",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      localStorage.removeItem("user-vibe");
      return window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button
      position={"fixed"}
      top="30px"
      right="30px"
      size="sm"
      onClick={handleLogout}
    >
      <FiLogOut size={20}/>
    </Button>
  );
};

export default LogoutButton;