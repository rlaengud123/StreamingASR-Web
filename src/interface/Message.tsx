export interface Message {
  language: "KO" | "EN";
  message_id: string;
  transcript?: string;
  translate?: string;
  receivedAt: string;
}

export interface MessagesState {
  KO: Message[];
  EN: Message[];
}
