export interface Chat {
  id: number;
  name: string;
  message: string;
  avatar: string;
}

export interface Message {
  id: number;
  sender: "me" | "them";
  text: string;
  time: string;
}

export interface Notification {
  id: number;
  message: string;
  link?: string;
}
