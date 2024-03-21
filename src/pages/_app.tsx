import { ChakraProvider, Box, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

// 위에서 정의한 Home 컴포넌트 안에 Chakra UI 컴포넌트를 사용

function App({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;
