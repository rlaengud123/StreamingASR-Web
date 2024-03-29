import React, { useEffect, useRef, useState } from "react";

import MessageDisplay from "@/components/MessageDisplay";
import RecordingBox from "@/components/RecordingBox";
import { Stack } from "@chakra-ui/react";
import useAudioRecording from "@/hooks/useAudioRecording";
import { useRouter } from "next/router";
import useWebSocket from "@/hooks/useWebSocket";
import useWebSocketMessages from "@/hooks/useWebsocketMessages";

const HomeComponent = () => {
  const router = useRouter();
  const path = router.pathname;
  const lastSegment = path.split("/").pop()?.replace('auto_',"");
  const baseUrl = `ws://${process.env.WEBSOCKET_URL}:${process.env.WEBSOCKET_PORT}/api/v1/stream/${lastSegment}`;
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const translateFlag = true
  const [wsUrl, setWsUrl] = useState(baseUrl);

  useEffect(() => {
    const params = new URLSearchParams();

    params.append("translate_flag", translateFlag.toString());
    setWsUrl(`${baseUrl}?${params}`);
  }, [translateFlag, baseUrl]);

  const { socket, connected, connectWebSocket } = useWebSocket(isRecording);
  const { messages, setMessages } = useWebSocketMessages(socket);
  const { startRecording, stopRecording, audioURL } = useAudioRecording(
    socket,
    setMessages,
    setIsRecording,
  );
  const latestMessageRef = useRef<HTMLDivElement | null>(null);

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
    <Stack alignItems="center">
      <RecordingBox
        isRecording={isRecording}
        connected={connected}
        handleButtonClick={handleButtonClick}
        wsUrl={wsUrl}
        connectWebSocket={connectWebSocket}
        audioURL={audioURL}
      />
      <MessageDisplay
        messages={messages}
        translateFlag={translateFlag}
        latestMessageRef={latestMessageRef}
      />
    </Stack>
  );
};

export default HomeComponent;
