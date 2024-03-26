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
        console.log("웹소켓 재 연결 시도...");
        reconnectWebSocket(url);
      };

      setSocket(newSocket);
    },
    [socket],
  );
  // 웹소켓을 재연결하기 위한 로직
  const reconnectWebSocket = useCallback(
    (url: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        return;
      }
      setTimeout(() => connectWebSocket(url), 3000); // 3초 후 재연결
    },
    [socket, connectWebSocket],
  );

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
