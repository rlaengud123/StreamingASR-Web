import { Box, HStack, Stack, VStack } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

import { Message } from "@/interface/Message";
import MessageComponent from "@/components/Message";
import RecordingBox from "@/components/RecordingBox";
import useAudioRecording from "@/hooks/useAudioRecording";
import useWebSocket from "@/hooks/useWebSocket";

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
  const [messages, setMessages] = useState<{ ko: Message[]; en: Message[] }>({
    ko: [],
    en: [],
  });
  const latestMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<string>): void => {
      const messageData: string = event.data;
      const [prefix, messageId, messageContent] = messageData.split(":", 3);
      const receivedAt = new Date().toLocaleTimeString(); // 현재 시간을 문자열로 기록
      const newMessage: Message = {
        message_id: messageId,
        content: messageContent,
        receivedAt: receivedAt,
      };

      setMessages(prevMessages => {
        const lang = prefix === "KO" ? "ko" : "en";
        const existingIndex = prevMessages[lang].findIndex(
          message => message.message_id === newMessage.message_id,
        );
        if (existingIndex > -1) {
          // 메시지 업데이트
          const updatedMessages = { ...prevMessages };
          updatedMessages[lang][existingIndex] = {
            ...updatedMessages[lang][existingIndex],
            ...newMessage,
          };
          return updatedMessages;
        } else {
          // 새 메시지 추가
          const updatedMessages = {
            ...prevMessages,
            [lang]: [...prevMessages[lang], newMessage],
          };
          updatedMessages[lang].sort(
            (a, b) => parseInt(a.message_id) - parseInt(b.message_id),
          );
          return updatedMessages;
        }
      });
    };
    if (socket) {
      socket.onmessage = handleMessage;
    }

    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socket]);

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
        {messages.ko.map((message, index) => (
          <HStack key={index} width="full" spacing={4} alignItems="start">
            <Box width="50%">
              <MessageComponent
                message={message}
                ref={index === messages.ko.length - 1 ? latestMessageRef : null}
              />
            </Box>
            {messages.en[index] && (
              <Box width="50%">
                <MessageComponent message={messages.en[index]} />
              </Box>
            )}
          </HStack>
        ))}
      </VStack>
    </Stack>
  );
};

export default TranscribeHome;
