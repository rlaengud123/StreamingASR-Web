import { Box, HStack, Stack, VStack } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";

import MessageComponent from "@/components/Message";
import RecordingBox from "@/components/RecordingBox";
import useAudioRecording from "@/hooks/useAudioRecording";
import useWebSocket from "@/hooks/useWebSocket";
import useWebSocketMessages from "@/hooks/useWebsocketMessages";

const TranscribeHome = () => {
  const params = new URLSearchParams({
    translate_flag: "true",
    src_lang: "ko_KR",
    tgt_lang: "en_XX",
  });
  const fullUrl = `ws://localhost:8080/api/v1/stream/transcribe?${params}`;

  const { socket, connected } = useWebSocket(fullUrl);
  const { isRecording, startRecording, stopRecording, audioURL } =
    useAudioRecording(socket);
  const latestMessageRef = useRef<HTMLDivElement | null>(null);
  const messages = useWebSocketMessages(socket);

  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function handleButtonClick() {
    if (!connected) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  return (
    <Stack alignItems="center">
      <RecordingBox
        isRecording={isRecording}
        connected={connected}
        handleButtonClick={handleButtonClick}
        audioURL={audioURL}
      />
      <VStack spacing={4} width="80%" margin="20px" justifyContent="center">
        {messages.KO.map((message, index) => (
          <HStack key={index} width="full" spacing={4} alignItems="start">
            <Box width="50%">
              <MessageComponent
                message={message}
                ref={index === messages.KO.length - 1 ? latestMessageRef : null}
              />
            </Box>
            {messages.EN[index] && (
              <Box width="50%">
                <MessageComponent message={messages.EN[index]} />
              </Box>
            )}
          </HStack>
        ))}
      </VStack>
    </Stack>
  );
};

export default TranscribeHome;
