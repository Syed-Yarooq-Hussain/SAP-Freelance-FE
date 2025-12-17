import { API_ROUTES } from "@/utils/api_routes";
import {
  ISendMessagePayload,
  IMessage,
  IConversationParams,
  IInboxItem,
  IMarkReadPayload,
} from "@/types/chat";
import { ApiResponse } from "@/types/api";
import { request } from "@/utils/request";


// ➤ SEND MESSAGE
export async function sendMessage(payload: ISendMessagePayload) {
  return await request<ISendMessagePayload, ApiResponse<IMessage>>({
    url: API_ROUTES.SEND_MESSAGE,
    method: "POST",
    data: payload,
  });
}


// ➤ GET CONVERSATION (sender + receiver)
export async function getConversation(params: IConversationParams) {
  return await request<undefined, ApiResponse<IMessage[]>>({
    url: `${API_ROUTES.GET_CONVERSATION}?sender_id=${params.sender_id}&receiver_id=${params.receiver_id}`,
    method: "GET",
  });
}


// ➤ MARK READ
export async function markRead(payload: IMarkReadPayload) {
  return await request<IMarkReadPayload, ApiResponse<null>>({
    url: API_ROUTES.MARK_READ,
    method: "POST",
    data: payload,
  });
}


// ➤ USER INBOX
export async function getInbox(user_id: number) {
  return await request<undefined, ApiResponse<IInboxItem[]>>({
    url: `${API_ROUTES.INBOX}?user_id=${user_id}`,
    method: "GET",
  });
}

// ➤ PROJECT CHAT
export async function getProjectChat(project_id: number) {
  return await request<undefined, ApiResponse<IMessage[]>>({
    url: `${API_ROUTES.PROJECT_CHAT}/${project_id}`,
    method: "GET",
  });
}


// ➤ GET ALL USERS
export async function getUsers() {
  return await request<undefined, ApiResponse<any[]>>({
    url: API_ROUTES.USERS,
    method: "GET",
  });
}
