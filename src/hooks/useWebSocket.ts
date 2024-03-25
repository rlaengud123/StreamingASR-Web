// hooks/useWebSocket.ts
import { useCallback, useEffect, useState } from "react";

const useWebSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  // URL을 인자로 받아 해당 URL로 웹소켓을 연결하는 함수
  const connectWebSocket = useCallback(
    (url: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        return;
      }

      const newSocket = new WebSocket(url);

      newSocket.onopen = () => {
        console.log("웹소켓 연결 성공");
        setConnected(true);
      };

      newSocket.onerror = (error: Event) => {
        console.error("웹소켓 에러:", error);
      };

      newSocket.onclose = () => {
        console.log("웹소켓 연결 끊김");
        setConnected(false);
        // 재연결 로직을 제거하거나 필요에 따라 조정합니다.
      };

      setSocket(newSocket);
    },
    [socket],
  ); // socket을 의존성 배열에 추가합니다.

  useEffect(() => {
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [socket]);

  return { socket, connected, setConnected, connectWebSocket };
};

export default useWebSocket;
