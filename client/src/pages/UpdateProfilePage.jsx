import { useState, useRef } from "react";
import getUserState from "../utils/getUserState";
import usePreviewImg from "../hooks/usePreviewImg";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
export default function UpdateProfilePage() {
  const user = getUserState();
  const [inputs, setInputs] = useState({
    username: user.username,
    name: user.name,
    bio: user.bio,
    email: user.email,
    password: "",
  });

  const fileRef = useRef(null);
  const [ updating, setUpdating ] = useState(false);
  const { handleImageChange, imageUrl } = usePreviewImg();
  const showToast = useShowToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(updating) return;
    setUpdating(true);
    try{
        const res = await fetch("/api/users/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...inputs, profilePic: imageUrl}),
        });

        const data = await res.json();
        if(data.error){
            showToast("Erro", data.error, "error");
            return;
        }

        showToast("Sucesso", "Perfil atualizado com sucesso", "success");
        localStorage.setItem("user-vibe", JSON.stringify(data));
        
    }catch(error){
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            Edite seu perfil
          </Heading>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar size="xl" src={imageUrl || user.profilePic} />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Trocar avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl >
            <FormLabel>Nome completo</FormLabel>
            <Input
              placeholder="João Victor"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl >
            <FormLabel>Nome de usuário</FormLabel>
            <Input
              placeholder="joaovictor"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl >
            <FormLabel>Endereço email</FormLabel>
            <Input
              placeholder="seu-email@example.com"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="email"
            />
          </FormControl>
          <FormControl >
            <FormLabel>Biografia</FormLabel>
            <Input
              placeholder="Estudante de informática."
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Senha</FormLabel>
            <Input
              placeholder="Senha"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              isLoading={updating}
            >
              Enviar
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
