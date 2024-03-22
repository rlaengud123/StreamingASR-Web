// hooks/useAudioRecording.ts
import { useState } from "react";

const useAudioRecording = (socket: WebSocket | null) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule("modules/audio-processor.js");
    const source = audioContext.createMediaStreamSource(stream);

    const processor = new AudioWorkletNode(audioContext, "pcm-processor");
    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.port.onmessage = (event: MessageEvent) => {
      const audioData = event.data;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(audioData);
      }
    };
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
      console.log("웹소켓 연결 종료");
    }
    setIsRecording(false);
  };

  return { isRecording, startRecording, stopRecording };
};

export default useAudioRecording;
