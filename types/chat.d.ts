export interface Chat {
  id: number;
  name: string;
  message: string;
  avatar: string;
}

export interface IMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  project_id?: number | null;
  message: string;
  message_type: string;
  createdAt: string;
  is_read: boolean;
}

export interface ISendMessagePayload {
  sender_id: number;
  receiver_id: number;
  message: string;
  project_id?: number | null;
  message_type: string; 
}

export interface IConversationParams {
  sender_id: number;
  receiver_id: number;
}

export interface IInboxItem {
  user_id: number;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export interface IMarkReadPayload {
  sender_id: number;
  receiver_id: number;
}

interface IUser {
  id: number;
  username: string;
  avatar?: string;
}

export interface Notification {
  id: number;
  message: string;
  link?: string;
}

export interface Message {
  id: number;
  sender: "me" | "them";
  text: string;
  time: string;
}
