import { Box } from "@chakra-ui/react";
import React from "react";

interface AudioPlayerProps {
  audioURL: string | null; // 오디오 URL
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioURL }) => {
  if (!audioURL) return <Box marginTop={"10px"}>No audio to play.</Box>;

  return (
    <Box marginY={"10px"}>
      <audio src={audioURL} controls>
        Your browser does not support the audio element.
      </audio>
    </Box>
  );
};

export default AudioPlayer;
