export interface Message {
  language: "ko" | "en";
  message_id: string;
  transcript?: string;
  translate?: string;
  receivedAt: string;
}

export interface MessagesState {
  original: Message[];
  translated: Message[];
}
