interface RecordingComponentProps {
  isRecording: boolean;
  connected: boolean;
  handleButtonClick: () => void;
  audioURL: string | null;
}
