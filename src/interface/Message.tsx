export interface Message {
  message_id: string;
  content: string;
  receivedAt: string;
}

export interface IntegratedMessage {
  ko?: Message; // ko 프로퍼티는 선택적이며, 한국어 메시지를 나타냅니다.
  en?: Message; // en 프로퍼티도 선택적이며, 영어 메시지를 나타냅니다.
}
