import { Box, Button, Link, Stack, Text, VStack } from "@chakra-ui/react";

import AudioPlayer from "./AudioPlayer"; // AudioPlayer 경로에 따라 조정 필요
import { FC } from "react";

const RecordingBox: FC<RecordingComponentProps> = ({
  isRecording,
  connected,
  handleButtonClick,
  wsUrl,
  connectWebSocket,
  audioURL,
}) => {
  return (
    <VStack spacing={4} width="full">
      <Box p={5} shadow="md" borderWidth="1px">
        <Text>
          {isRecording
            ? "녹음 중..."
            : connected
              ? "녹음 준비됨"
              : "웹소켓 연결 필요"}
        </Text>
        <Stack direction="row">
          <Link href="/">
            <Button colorScheme="blue">뒤로 가기</Button>
          </Link>
          <Button
            colorScheme={connected ? "blue" : "gray"}
            disabled={connected}
            onClick={() => connectWebSocket(wsUrl)}
          >
            {connected ? "웹소켓 연결 됨" : "웹소켓 연결"}
          </Button>
          <Button
            colorScheme={isRecording ? "red" : connected ? "green" : "gray"}
            disabled={!connected}
            onClick={handleButtonClick}
          >
            {isRecording ? "녹음 중지" : "녹음 시작"}
          </Button>
        </Stack>
        <AudioPlayer audioURL={audioURL} />
      </Box>
    </VStack>
  );
};

export default RecordingBox;

// RecordingComponent에 대한 설명입니다.
// isRecording: 녹음 중인지 여부를 나타내는 boolean 타입입니다.
// connected: 웹소켓 연결 여부를 나타내는 boolean 타입입니다.
// handleButtonClick: 버튼 클릭 이벤트를 처리하는 함수입니다.
// audioURL: 오디오 파일의 URL을 나타내는 string 타입입니다.
