// hooks/useWebSocket.ts
import { useEffect, useState } from "react";

const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const connectWebSocket = () => {
      const newSocket = new WebSocket(url);

      newSocket.onopen = () => {
        console.log("웹소켓 연결 성공");
        setConnected(true);
      };

      newSocket.onerror = (error: Event) => {
        console.error("웹소켓 에러:", error);
      };

      newSocket.onclose = () => {
        console.log("웹소켓 연결 끊김, 재연결 시도...");
        setTimeout(connectWebSocket, 3000);
      };

      setSocket(newSocket);
    };

    connectWebSocket();

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  return { socket, connected, setConnected };
};

export default useWebSocket;
