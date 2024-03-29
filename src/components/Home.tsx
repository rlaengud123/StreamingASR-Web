import React, { useEffect, useRef, useState } from "react";

import MessageDisplay from "@/components/MessageDisplay";
import RecordingBox from "@/components/RecordingBox";
import { Stack } from "@chakra-ui/react";
import TranslationParamsBox from "@/components/TranslationParamsBox";
import useAudioRecording from "@/hooks/useAudioRecording";
import { useRouter } from "next/router";
import useWebSocket from "@/hooks/useWebSocket";
import useWebSocketMessages from "@/hooks/useWebsocketMessages";

const HomeComponent = () => {
  const router = useRouter();
  const path = router.pathname;
  const lastSegment = path.split("/").pop();
  const autoFlag = lastSegment?.includes("auto_");
  const cleanedLastSegment = lastSegment?.replace("auto_", "");
  const baseUrl = `ws://${process.env.WEBSOCKET_URL}:${process.env.WEBSOCKET_PORT}/api/v1/stream/${cleanedLastSegment}`;
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [translateFlag, setTranslateFlag] = useState(true);
  const [srcLang, setSrcLang] = useState("ko");
  const [tgtLang, setTgtLang] = useState("en");
  const [wsUrl, setWsUrl] = useState(baseUrl);

  useEffect(() => {
    const params = new URLSearchParams();
    params.append("translate_flag", translateFlag.toString());

    if (!autoFlag) {
      params.append("src_lang", srcLang);

      if (translateFlag) {
        if (srcLang === "ko") {
          setTgtLang("en");
        } else {
          setTgtLang("ko");
        }
        params.append("tgt_lang", tgtLang);
      }
    }

    setWsUrl(`${baseUrl}?${params}`);
  }, [autoFlag, translateFlag, srcLang, tgtLang, baseUrl]);

  const { socket, connected, connectWebSocket } = useWebSocket();
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

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      return;
    }
    if (isRecording) {
      console.log("웹소켓 재연결 시도 중...");
      setTimeout(() => connectWebSocket(wsUrl), 3000); // 3초 후 재연결
    }
  }, [socket, connectWebSocket]);

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
      {!autoFlag && (
        <TranslationParamsBox
          translateFlag={translateFlag}
          setTranslateFlag={setTranslateFlag}
          srcLang={srcLang}
          setSrcLang={setSrcLang}
        />
      )}
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
