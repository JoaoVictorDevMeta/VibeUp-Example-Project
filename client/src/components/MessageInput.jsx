import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { IoSendSharp } from "react-icons/io5";
import React, { useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { selectedConversationAtom, chatsAtom } from "../atoms/messagesAtom";
import { useAtom } from "jotai";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const [selectedConversation, _] = useAtom(selectedConversationAtom);
  const setChats = useAtom(chatsAtom)[1];
  const showToast = useShowToast();
  const imageRef = useRef(null);
  const { onClose } = useDisclosure();
  const { imageUrl, handleImageChange, setImageUrl} = usePreviewImg();
  const [ isSending, setIsSending ] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText && !imageUrl) return;
    if (isSending) return;

    setIsSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          img: imageUrl,
          text: messageText,
          recipientId: selectedConversation.userId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Erro", data.error, "error");
        return;
      }
      setMessages((prev) => [...prev, data]);
      setChats((prevChats) => {
        const updatedChat = prevChats.map((chat) => {
          if (chat.id === selectedConversation.id) {
            return { ...chat, messages: [data] };
          }
          return chat;
        });
        return updatedChat;
      });

      setImageUrl("");
      setMessageText("");
    } catch (error) {
      showToast("Erro", error.message, "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            w={"full"}
            placeholder="Digite sua mensagem"
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          ></Input>
          <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
            <IoSendSharp color={"green.500"} />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={"pointer"}>
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
        <Input
          type={"file"}
          hidden
          ref={imageRef}
          onChange={handleImageChange}
        />
      </Flex>
      <Modal
        isOpen={imageUrl}
        onClose={() => {
          onClose();
          setImageUrl("");
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"}>
              <Image src={imageUrl} />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!isSending ? (
                <IoSendSharp
                  size={24}
                  cursor={"pointer"}
                  onClick={handleSendMessage}
                />
              ) : (
                <Spinner size={"md"} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;
