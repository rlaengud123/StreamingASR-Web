import { Box, HStack, VStack } from "@chakra-ui/react";
import React, { LegacyRef } from "react";

import MessageComponent from "./Message";
import { MessagesState } from "@/interface/Message";

const MessageDisplay: React.FC<{
  messages: MessagesState;
  translateFlag: boolean;
  latestMessageRef: LegacyRef<HTMLDivElement>;
}> = ({ messages, translateFlag, latestMessageRef }) => {
  return (
    <VStack spacing={4} width="80%" margin="20px" justifyContent="center">
      {messages.original.map((message, index) => (
        <HStack key={index} width="full" spacing={4} alignItems="start">
          <Box width={translateFlag ? "50%" : "full"}>
            <MessageComponent
              message={message}
              ref={
                index === messages.original.length - 1 ? latestMessageRef : null
              }
            />
          </Box>
          {translateFlag && messages.translated[index] && (
            <Box width="50%">
              <MessageComponent message={messages.translated[index]} />
            </Box>
          )}
        </HStack>
      ))}
    </VStack>
  );
};

export default MessageDisplay;
