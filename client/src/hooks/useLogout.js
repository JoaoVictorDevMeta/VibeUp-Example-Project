import { useToast } from '@chakra-ui/react';

const useLogout = () => {
 const toast = useToast();

  const logout = async () => {
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

    return logout;
}

export default useLogout