import React, { useRef, useState } from "react";
import {
  Button,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalContent,
  Textarea,
  FormControl,
  Text,
  ModalCloseButton,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  Flex,
  Image,
    CloseButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { useAtom } from "jotai";
import { postAtom } from "../atoms/postAtom";
import { useParams } from "react-router-dom";
import getUserState from "../utils/getUserState";

const MAX_CHAR = 500;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useShowToast();
  const { handleImageChange, imageUrl, setImageUrl } = usePreviewImg();
  const [postText, setPostText] = React.useState("");
  const [ remainingChar, setRemainingChar ] = React.useState(MAX_CHAR);
  const imageRef = useRef(null);
  const [ loading, setLoading ] = useState(false);
  const [ posts, setPosts ] = useAtom(postAtom);
  const { username } = useParams();
  const user = getUserState();
  
  const handleTextChange = (e) => {
    const inputText = e.target.value

    if(inputText.length > MAX_CHAR){
      const truncatedText = inputText.slice(0, MAX_CHAR);
        setPostText(truncatedText);
        setRemainingChar(0);
    }else{
        setPostText(inputText);
        setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

    const handleCreatePost = async () => {
        try{
            setLoading(true);
            const res = await fetch("/api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: postText, img:imageUrl }),
            });

            const data = await res.json();
            if(data.error){
                showToast("Erro", data.error, "error");
                return;
            }

            showToast("Sucesso", "Post criado com sucesso", "success");
            if(username === user.username){
              setPosts([data, ...posts]);
            }
            setPostText("");
            setImageUrl("");
            onClose();
        }catch{
            showToast("Erro", "Erro ao criar post", "error");
        } finally {
            setLoading(false);
        }
    };

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
      >
        Postar algo...
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Postar Vibe</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post content goes here.."
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {`${remainingChar}/${MAX_CHAR}`}
              </Text>

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>

            {imageUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imageUrl} alt="Selected img" />
                <CloseButton
                  onClick={() => {
                    setImageUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
