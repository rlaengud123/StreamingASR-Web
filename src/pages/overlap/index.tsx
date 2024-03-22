import { Box, Button, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

let socket: WebSocket;

interface Message {
  message_id: string;
  content: string;
  receivedAt: string;
}

const Home = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const latestMessageRef = useRef<HTMLDivElement | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  const connectWebSocket = () => {
    // WebSocket 연결을 시도합니다.
    socket = new WebSocket("ws://localhost:8080/api/v1/stream/overlap");

    socket.onopen = () => {
      console.log("웹소켓 연결 성공");
      setConnected(true);
    };

    socket.onmessage = event => {
      console.log("서버로부터 메시지 수신:", event.data);
    };

    socket.onerror = error => {
      console.error("웹소켓 에러:", error);
    };

    socket.onclose = () => {
      console.log("웹소켓 연결 끊김, 재연결 시도...");
      setTimeout(connectWebSocket, 3000); // 3초 후 재연결 시도
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      // 컴포넌트가 언마운트될 때 WebSocket 연결을 종료합니다.
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
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

    if (socket) {
      socket.onmessage = handleMessage;
    }

    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, []);

  useEffect(() => {
    // Scroll the latest message into view when messages update
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Dependency array includes messages to trigger on update

  // Home 컴포넌트 내부에 추가
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule("modules/audio-processor.js"); // AudioWorkletProcessor 로드
    const source = audioContext.createMediaStreamSource(stream);

    const processor = new AudioWorkletNode(audioContext, "pcm-processor");
    source.connect(processor);
    processor.connect(audioContext.destination);

    // AudioWorkletProcessor에서 전송된 데이터를 받음
    processor.port.onmessage = event => {
      const audioData = event.data;
      // 이 부분에서 audioData를 웹소켓을 통해 서버로 전송합니다.
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(audioData);
      }
    };
    setIsRecording(true);
  };

  const stopRecording = () => {
    // Close the WebSocket connection when stopping the recording
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
      console.log("웹소켓 연결 종료");
    }
    setIsRecording(false);
  };

  function handleButtonClick() {
    if (!connected) return; // 연결되지 않았다면 아무 동작도 하지 않음
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

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
            ref={index === messages.length - 1 ? latestMessageRef : null} // Assign ref to last message
          >
            <Text fontWeight="bold">Message ID {message.message_id}:</Text>
            <Text mt={2}>{message.content}</Text>
            <Text fontSize="sm" color="gray.500">
              {message.receivedAt}
            </Text>
          </Box>
        ))}
      </Stack>
    </>
  );
};

export default Home;
