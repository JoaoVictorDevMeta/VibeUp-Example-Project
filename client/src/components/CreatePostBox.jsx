import {
  Button,
  CloseButton,
  Flex,
  Image,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import getUserState from "../utils/getUserState";

const MAX_CHAR = 500;

const CreatePostBox = () => {
  const { handleImageChange, imageUrl, setImageUrl } = usePreviewImg();
  const [postText, setPostText] = useState("");
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const imageRef = useRef(null);
  const showToast = useShowToast();
  const user = getUserState();
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  //loading
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: postText,
          img: imageUrl,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Erro", data.error, "error");
        return;
      }
      setPostText("");
      setImageUrl("");
      showToast("Sucesso", "Post criado com sucesso", "success");
      setLoading(false);
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Erro", error, "error");
    }
  };

  return (
    <>
      <Flex
        flexDirection={"column"}
        px={5}
        maxH={postText || isFocused ? "500px" : "100px"}
        overflow={"hidden"}
        transition={"max-height 0.3s ease"}
      >
        <Flex>
          <Textarea
            placeholder="O que esta acontecendo?"
            h="100px"
            maxH="230px"
            onChange={handleTextChange}
            value={postText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          ></Textarea>
        </Flex>
        {imageUrl && (
          <Flex mt={5} w={"full"} position={"relative"}>
            <Image
              src={imageUrl}
              alt="Selected img"
              borderRadius={5}
              maxW={"400px"}
            />
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
        <Flex justifyContent={"flex-end"}>
          <Text>{`${remainingChar}/${MAX_CHAR}`}</Text>
        </Flex>
        <Flex justifyContent={"space-between"} mt={3}>
          <Flex alignItems={"center"} gap={3}>
            <Input
              type="file"
              hidden
              ref={imageRef}
              onChange={handleImageChange}
            />
            <BsFillImageFill
              style={{ marginLeft: "5px", cursor: "pointer" }}
              size={20}
              onClick={() => imageRef.current.click()}
            />
            <FaRegUser
              style={{ marginLeft: "5px", cursor: "pointer" }}
              size={20}
            />
          </Flex>

          <Button
            colorScheme="blue"
            onClick={handleCreatePost}
            isLoading={loading}
          >
            Postar
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default CreatePostBox;
