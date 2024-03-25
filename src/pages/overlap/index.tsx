import React, { useEffect, useRef } from "react";

import MessageComponent from "@/components/Message";
import RecordingBox from "@/components/RecordingBox";
import { Stack } from "@chakra-ui/react";
import useAudioRecording from "@/hooks/useAudioRecording";
import useWebSocket from "@/hooks/useWebSocket";
import useWebSocketMessages from "@/hooks/useWebsocketMessages";

const OverlapHome = () => {
  const { socket, connected } = useWebSocket(
    "ws://localhost:8080/api/v1/stream/overlap",
  );
  const { isRecording, startRecording, stopRecording, audioURL } =
    useAudioRecording(socket);
  const latestMessageRef = useRef<HTMLDivElement | null>(null);
  const messages = useWebSocketMessages(socket);

  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleButtonClick = () => {
    if (!connected) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <>
      <RecordingBox
        isRecording={isRecording}
        connected={connected}
        handleButtonClick={handleButtonClick}
        audioURL={audioURL}
      />
      <Stack spacing={4} marginX={"30px"} marginY={"20px"}>
        {messages.KO.map((message, index) => (
          <MessageComponent
            key={index}
            message={message}
            ref={index === messages.KO.length - 1 ? latestMessageRef : null}
          />
        ))}
      </Stack>
    </>
  );
};

export default OverlapHome;
