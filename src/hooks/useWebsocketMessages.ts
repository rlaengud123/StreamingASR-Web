import { Message, MessagesState } from "@/interface/Message";
import { useEffect, useState } from "react";

function useWebSocketMessages(socket: WebSocket | null) {
  const [messages, setMessages] = useState<MessagesState>({
    original: [],
    translated: [],
  });

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
        const messageType = newMessage.transcript ? "original" : "translated";
        const existingIndex = prevMessages[messageType].findIndex(
          message => message.message_id === newMessage.message_id,
        );

        // 새 메시지 인덱스 채우기 로직 시작
        const lastMessageId = prevMessages[messageType].length
          ? parseInt(
              prevMessages[messageType][prevMessages[messageType].length - 1]
                .message_id,
            )
          : -1;
        const newMessageId = parseInt(newMessage.message_id);
        if (newMessageId > lastMessageId + 1) {
          // 빠진 인덱스에 대한 빈 메시지 생성
          const missingMessages: Message[] = [];
          for (let id = lastMessageId + 1; id < newMessageId; id++) {
            missingMessages.push({
              language: newMessage.language,
              message_id: id.toString(),
              receivedAt: "",
            });
          }
          prevMessages[messageType] = [
            ...prevMessages[messageType],
            ...missingMessages,
          ];
        }
        // 새 메시지 인덱스 채우기 로직 끝

        if (existingIndex > -1) {
          const existingMessage = prevMessages[messageType][existingIndex];
          const isOriginal = messageType === "original";

          if (
            isOriginal &&
            existingMessage.transcript &&
            newMessage.transcript &&
            newMessage.transcript.length < existingMessage.transcript.length
          ) {
            // 이전 원문이 더 길면 업데이트하지 않음
            return prevMessages;
          } else if (
            !isOriginal &&
            existingMessage.translate &&
            newMessage.translate &&
            newMessage.translate.length < existingMessage.translate.length
          ) {
            // 이전 번역문이 더 길면 업데이트하지 않음
            return prevMessages;
          }

          // 메시지 업데이트
          const updatedMessages: MessagesState = { ...prevMessages };
          updatedMessages[messageType][existingIndex] = {
            ...existingMessage,
            ...newMessage,
          };
          return updatedMessages;
        } else {
          // 새 메시지 추가
          const updatedMessages: MessagesState = {
            ...prevMessages,
            [messageType]: [...prevMessages[messageType], newMessage].sort(
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

  return { messages, setMessages };
}

export default useWebSocketMessages;
