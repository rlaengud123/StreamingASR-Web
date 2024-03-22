import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";

// Home 컴포넌트가 정의되어 있다고 가정할 때, Chakra UI 컴포넌트를 사용하는 예시

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default App;

// App 컴포넌트에 대한 설명입니다.
// ChakraProvider를 사용하여 전체 애플리케이션에 Chakra UI 컴포넌트 스타일을 적용합니다.
// Component와 pageProps는 Next.js에서 페이지를 렌더링할 때 사용하는 속성입니다.
