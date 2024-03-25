interface RecordingComponentProps {
  isRecording: boolean;
  connected: boolean;
  handleButtonClick: () => void;
  wsUrl: string;
  connectWebSocket: (url: string) => void;
  audioURL: string | null;
}
