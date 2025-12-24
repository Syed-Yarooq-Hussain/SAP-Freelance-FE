"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import type { Chat, IMessage } from "@/types/chat";
import { getUsers, getConversation, sendMessage, markRead } from "@/services/chat";
import { useSession } from "next-auth/react";
import { notifications } from "@/data/rightSideDrawer";

interface ChatSectionProps {
  open: boolean;
  type: "chat" | "notification";
  onClose: () => void;
}

const ChatSection: React.FC<ChatSectionProps> = ({
  open,
  type,
  onClose,
}) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { data: session } = useSession();

  const currentUser = {
    id: Number(session?.user?.id),
  };

  // FETCH USERS LIST
  useEffect(() => {
    if (type === "chat") fetchUsersList();
  }, [type]);

  const fetchUsersList = async () => {
    try {
      const res = await getUsers();
      if (res.status === "success" && Array.isArray(res.data)) {
        const users: Chat[] = res.data.map((u) => ({
          id: u.id,
          name: u.username,
          avatar: u.avatar ?? "",
          message: "",
        }));
        setChatList(users);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  // FETCH CONVERSATION
  const fetchConversationForUser = async (chat: Chat) => {
    try {
      const res = await getConversation({
        sender_id: currentUser.id,
        receiver_id: chat.id,
      });

      if (res.status === "success" && Array.isArray(res.data)) {
        setMessages(
          res.data.map((m, index: number): IMessage => ({
            id: index,
            sender_id: Number(m.sender_id),
            receiver_id: Number(m.receiver_id),
            project_id: m.project_id ?? null,
            message: m.message,
            message_type: m.type,
            created_at: m.created_at,
            is_read: m.is_read,
          }))
        );
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to fetch conversation:", err);
    }
  };

  // MARK READ FUNCTION
  const markConversationRead = async (receiverId: number) => {
    try {
      await markRead({
        sender_id: receiverId,
        receiver_id: currentUser.id,
      });

      setMessages((prev) => prev.map((m) => ({ ...m, is_read: true })));
    } catch (err) {
      console.error("Failed to mark messages read:", err);
    }
  };

  useEffect(() => {
    if (!selectedChat) return;

    const loadChat = async () => {
      await fetchConversationForUser(selectedChat);
      await markConversationRead(selectedChat.id);
    };

    loadChat();
  }, [selectedChat]);

  // SEND MESSAGE
  const handleSend = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const payload = {
      sender_id: currentUser.id,
      receiver_id: selectedChat.id,
      project_id: selectedChat.id,
      message: newMessage,
      message_type: "send",
    };

    try {
      const res = await sendMessage(payload);

      if (res.status === "success") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender_id: payload.sender_id,
            receiver_id: payload.receiver_id,
            project_id: payload.project_id,
            message: payload.message,
            message_type: payload.message_type,
            created_at: new Date().toISOString(),
            is_read: false,
          },
        ]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            top: 50,
            height: "calc(100% - 50px)",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            boxShadow: 4,
          },
        },
      }}
    >
      <Box sx={{ width: 300, display: "flex", flexDirection: "column", height: "100%" }}>
        
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 1,
            py: 1,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {type === "chat" && selectedChat && (
              <IconButton size="small" onClick={() => setSelectedChat(null)}>
                <ArrowBackIcon fontSize="small" />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 600 }}>
              {type === "chat" ? "Chat" : "Notification"}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* CHAT LIST */}
        {type === "chat" && !selectedChat && (
          <List sx={{ flex: 1, overflowY: "auto" }}>
            {chatList.map((chat) => (
              <React.Fragment key={chat.id}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setSelectedChat(chat)}>
                    <ListItemAvatar>
                      <Avatar src={chat.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={chat.name}
                      primaryTypographyProps={{
                        sx: { fontSize: "0.875rem", fontWeight: 500 },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}

        {/* CHAT WINDOW */}
        {type === "chat" && selectedChat && (
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            
            {/* CHAT HEADER */}
            <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={selectedChat.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={selectedChat.name}
                  primaryTypographyProps={{
                    sx: { fontSize: "0.9rem", fontWeight: 600 },
                  }}
                />
              </ListItem>
            </Box>

            {/* CHAT MESSAGES */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                px: 2,
                py: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
              }}
            >
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    alignSelf: msg.message_type === "send" ? "flex-end" : "flex-start",
                    bgcolor: msg.message_type === "send" ? "#1976d2" : "#f1f1f1",
                    color: msg.message_type === "send" ? "#fff" : "#000",
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.75,
                    maxWidth: "80%",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontSize: "0.65rem", fontWeight: 600 }}
                  >
                    {msg.message_type === "send" ? "You" : selectedChat?.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.8rem" }}
                  >
                    {msg.message}
                  </Typography>

                  {msg.message_type === "send" && (
                    <Typography
                      variant="caption"
                      sx={{ mt: 0.25, opacity: 0.7, fontSize: "0.65rem" }}
                    >
                      {msg.is_read ? "Read ✅" : "Unread"}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>

            {/* MESSAGE INPUT */}
            <Box sx={{ p: 1, borderTop: "1px solid #ddd" }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton color="primary" onClick={handleSend}>
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        )}

        {/* NOTIFICATIONS */}
        {type === "notification" && (
          <List sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            {notifications.map((notif) => (
              <Box
                key={notif.id}
                sx={{
                  bgcolor: "#f8f8f8",
                  p: 1.8,
                  mb: 2,
                }}
              >
                <Typography sx={{ fontSize: "0.9rem" }}>{notif.message}</Typography>
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default ChatSection;
