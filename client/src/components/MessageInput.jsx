import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { IoSendSharp } from "react-icons/io5";
import React from "react";

const MessageInput = () => {
  return (
    <form>
      <InputGroup>
        <Input w={"full"} placeholder="Digite sua mensagem"></Input>
        <InputRightElement>
          <IoSendSharp color={"green.500"} />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
