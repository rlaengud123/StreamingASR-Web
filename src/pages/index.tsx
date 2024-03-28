import { Button, Container, Stack } from "@chakra-ui/react";

import Link from "next/link";

const Home = () => {
  return (
    <Container centerContent>
      <Stack spacing={4} align="stretch" mt={"20px"}>
        <Link href="/overlap" passHref>
          <Button colorScheme="teal">Go to Overlap</Button>
        </Link>
        <Link href="/transcribe" passHref>
          <Button colorScheme="teal">Go to Transcribe</Button>
        </Link>
        <Link href="/auto_overlap" passHref>
          <Button colorScheme="teal">Go to Language Detect Overlap</Button>
        </Link>
        <Link href="/auto_transcribe" passHref>
          <Button colorScheme="teal">Go to Language Detect Transcribe</Button>
        </Link>
      </Stack>
    </Container>
  );
};

export default Home;
