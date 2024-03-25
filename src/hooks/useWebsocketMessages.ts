import { useEffect, useState } from "react";

interface Message {
  language: "KO" | "EN";
  message_id: string;
  transcript?: string;
  translate?: string;
  receivedAt: string;
}

interface MessagesState {
  KO: Message[];
  EN: Message[];
}

function useWebSocketMessages(socket: WebSocket | null): MessagesState {
  const [messages, setMessages] = useState<MessagesState>({ KO: [], EN: [] });

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const messageData = event.data;
      const messageObj: Message = JSON.parse(messageData);
      const receivedAt = new Date().toLocaleTimeString();
      const newMessage: Message = {
        ...messageObj,
        receivedAt,
      };

      setMessages(prevMessages => {
        const language = newMessage.language;
        const existingIndex = prevMessages[language].findIndex(
          message => message.message_id === newMessage.message_id,
        );

        if (existingIndex > -1) {
          const existingMessage = prevMessages[language][existingIndex];
          if (
            newMessage.transcript &&
            existingMessage.transcript &&
            newMessage.transcript.length < existingMessage.transcript.length
          ) {
            // 이전 메시지가 더 길면 업데이트하지 않음
            return prevMessages;
          }

          // 메시지 업데이트
          const updatedMessages: MessagesState = { ...prevMessages };
          updatedMessages[language][existingIndex] = {
            ...existingMessage,
            ...newMessage,
          };
          return updatedMessages;
        } else {
          // 새 메시지 추가
          const updatedMessages: MessagesState = {
            ...prevMessages,
            [language]: [...prevMessages[language], newMessage].sort(
              (a, b) => parseInt(a.message_id) - parseInt(b.message_id),
            ),
          };
          return updatedMessages;
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

  return messages;
}

export default useWebSocketMessages;
