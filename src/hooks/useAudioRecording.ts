import { useEffect, useState } from "react";

import { MessagesState } from "@/interface/Message";
import React from "react";

const useAudioRecording = (
  socket: WebSocket | null,
  setMessages: React.Dispatch<React.SetStateAction<MessagesState>>,
) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 녹음 중지 및 리소스 해제
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule("modules/audio-processor.js");
    const source = audioContext.createMediaStreamSource(stream);

    const processor = new AudioWorkletNode(audioContext, "pcm-processor");
    source.connect(processor);
    processor.connect(audioContext.destination);

    const newMediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(newMediaRecorder);

    let audioChunks: BlobPart[] = [];

    newMediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    newMediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
    };

    processor.port.onmessage = (event: MessageEvent) => {
      const audioData = event.data;
      if (socket && socket.readyState === WebSocket.OPEN) {
        const sendedAt = new Date().toLocaleTimeString();
        console.log(audioData, sendedAt);
        socket.send(audioData);
      }
    };

    newMediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
      console.log("웹소켓 연결 종료");
    }
    setIsRecording(false);
    setMessages({
      original: [],
      translated: [],
    });
  };

  return { isRecording, startRecording, stopRecording, audioURL };
};

export default useAudioRecording;
