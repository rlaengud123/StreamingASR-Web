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
  const baseUrl = `ws://localhost:8080/api/v1/stream/${lastSegment}`;
  const [translateFlag, setTranslateFlag] = useState(true);
  const [srcLang, setSrcLang] = useState("ko");
  const [tgtLang, setTgtLang] = useState("en");
  const [wsUrl, setWsUrl] = useState(baseUrl);

  useEffect(() => {
    const params = new URLSearchParams();

    params.append("translate_flag", translateFlag.toString());
    params.append("src_lang", srcLang);

    if (translateFlag) {
      if (srcLang === "ko") {
        setTgtLang("en");
      } else {
        setTgtLang("ko");
      }
      params.append("tgt_lang", tgtLang);
    }

    setWsUrl(`${baseUrl}?${params}`);
  }, [translateFlag, srcLang, tgtLang, baseUrl]);

  const { socket, connected, connectWebSocket } = useWebSocket();
  const { messages, setMessages } = useWebSocketMessages(socket);
  const { isRecording, startRecording, stopRecording, audioURL } =
    useAudioRecording(socket, setMessages);
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
      <TranslationParamsBox
        translateFlag={translateFlag}
        setTranslateFlag={setTranslateFlag}
        srcLang={srcLang}
        setSrcLang={setSrcLang}
      />
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
