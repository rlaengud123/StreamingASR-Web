declare global {
    namespace NodeJS {
      interface ProcessEnv {
        WEBSOCKET_URL: string;
        WEBSOCKET_PORT: string;
      }
    }
  }
  
  export {};