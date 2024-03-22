import { Box, Button, Link, Stack, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

import AudioPlayer from "@/components/AudioPlayer";
import { Message } from "@/interface/Message";
import useAudioRecording from "@/hooks/useAudioRecording";
import useWebSocket from "@/hooks/useWebSocket";

const OverlapHome = () => {
  const { socket, connected } = useWebSocket(
    "ws://localhost:8080/api/v1/stream/overlap",
  );
  const { isRecording, startRecording, stopRecording, audioURL } =
    useAudioRecording(socket);
  const [messages, setMessages] = useState<Message[]>([]);
  const latestMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent<string>): void => {
      const messageData: string = event.data;
      const [messageId, messageContent] = messageData.split(":", 2);
      const receivedAt = new Date().toLocaleTimeString(); // 현재 시간을 문자열로 기록
      const newMessage: Message = {
        message_id: messageId,
        content: messageContent,
        receivedAt: receivedAt,
      };

      setMessages(prevMessages => {
        const existingIndex = prevMessages.findIndex(
          message => message.message_id === newMessage.message_id,
        );
        if (existingIndex > -1) {
          const existingMessage = prevMessages[existingIndex];
          if (newMessage.content.length < existingMessage.content.length) {
            return prevMessages;
          }

          const updatedMessages = [...prevMessages];
          updatedMessages[existingIndex] = {
            ...updatedMessages[existingIndex],
            ...newMessage,
          };
          return updatedMessages;
        } else {
          return [...prevMessages, newMessage].sort(
            (a, b) => parseInt(a.message_id) - parseInt(b.message_id),
          );
        }
      });
    };

    socket.onmessage = handleMessage;

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
      <VStack spacing={4} width={"full"}>
        <Box p={5} shadow="md" borderWidth="1px">
          <Text>
            {isRecording
              ? "녹음 중..."
              : connected
                ? "녹음 준비됨"
                : "웹소켓 연결 불가"}
          </Text>
          <Stack direction={"row"}>
            <Link href="/">
              <Button colorScheme="blue">뒤로 가기</Button>
            </Link>
            <Button
              colorScheme={isRecording ? "red" : connected ? "blue" : "gray"}
              disabled={!connected}
              onClick={handleButtonClick}
            >
              {isRecording ? "녹음 중지" : "녹음 시작"}
            </Button>
          </Stack>
          <AudioPlayer audioURL={audioURL} />
        </Box>
      </VStack>
      <Stack spacing={4} marginX={"30px"} marginY={"20px"}>
        {messages.map((message, index) => (
          <Box
            key={index}
            p={4}
            shadow="sm"
            borderWidth="1px"
            borderRadius="md"
            backgroundColor="blue.50"
            ref={index === messages.length - 1 ? latestMessageRef : null}
          >
            <Text fontWeight="bold">Message ID {message.message_id}:</Text>
            <Text mt={2}>{message.content}</Text>
            <Text fontSize="sm" color="gray.500">
              Received at: {message.receivedAt}
            </Text>
          </Box>
        ))}
      </Stack>
    </>
  );
};

export default OverlapHome;
