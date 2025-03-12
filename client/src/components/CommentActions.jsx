import {
    Button,
    Input,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverBody,
    PopoverHeader,
    Portal,
    Text,
    useColorModeValue,
    Flex,
  } from "@chakra-ui/react";
  import { BsThreeDots } from "react-icons/bs";
  
  const CommentActions = () => {
    return (
      <>
        <Popover>
          <PopoverTrigger>
            <BsThreeDots cursor={"pointer"} />
          </PopoverTrigger>
          <Portal>
            <PopoverContent bg={useColorModeValue("white", "gray.dark")} boxShadow="none">
              <PopoverArrow />
              <PopoverBody>
                <Flex gap={2}>
                  <Button>Deletar</Button>
                  <Button>Editar</Button>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </>
    );
  };
  
  export default CommentActions;