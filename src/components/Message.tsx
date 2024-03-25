import { Box, Stack, Text } from "@chakra-ui/react";

import { Message } from "@/interface/Message";
import React from "react";

interface MessageComponentProps {
  message: Message;
}

const MessageComponent = React.forwardRef<
  HTMLDivElement,
  MessageComponentProps
>(({ message }, ref?) => {
  return (
    <Box
      p={4}
      shadow="sm"
      borderWidth="1px"
      borderRadius="md"
      backgroundColor="blue.50"
      width={"full"}
      ref={ref ? ref : null} // 여기에 ref 할당
    >
      <Text fontWeight="bold">Message ID {message.message_id}:</Text>
      <Text mt={2}>
        {message.language == "KO" ? message.transcript : message.translate}
      </Text>
      <Text fontSize="sm" color="gray.500">
        {message.receivedAt}
      </Text>
    </Box>
  );
});
export default MessageComponent;
