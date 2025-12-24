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
            createdAt: m.date_time,
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
  const markConversationRead = async () => {
    if (!selectedChat) return;
    try {
      const payload = {
        sender_id: selectedChat.id,
        receiver_id: currentUser.id,
      };
      await markRead(payload);
    } catch (err) {
      console.error("Failed to mark messages read:", err);
    }
  };

  useEffect(() => {
    if (!selectedChat) return;

    const loadChat = async () => {
      await fetchConversationForUser(selectedChat);
      await markConversationRead();
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
            createdAt:  new Date().toISOString(),
            is_read: false,
          },
        ]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };


const formatTime = (pgTime?: string) => {
  if (!pgTime) return "Invalid Time";

  // Convert backend string to JS Date directly
  const date = new Date(pgTime); // JS automatically handles ISO format
  if (isNaN(date.getTime())) return "Invalid Time";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
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
            background: "linear-gradient(#D9EBFF, #EBFCFF, #FFF5F5)",
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
            borderBottom: "1.33px solid #006F75",
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {type === "chat" && selectedChat && (
              <IconButton size="small" onClick={() => setSelectedChat(null)}>
                <ArrowBackIcon fontSize="small" sx={{color: "#75000E"}} />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontSize: "1.1rem", marginLeft:2, fontWeight: 1000, color: "#062441" }}>
              {type === "chat" ? "Chat" : "Notification"}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{color: "#75000E"}}/>
          </IconButton>
        </Box>

        {/* CHAT LIST */}
        {type === "chat" && !selectedChat && (
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            {/* Scrollable chat list */}
          <List sx={{ flex: 1, overflowY: "auto" }}>
            {chatList.map((chat) => (
              <React.Fragment key={chat.id}>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setSelectedChat(chat)}>
                    <ListItemAvatar>
                      <Avatar sx={{ border: "1.34px solid #006F75"}}
                       src={chat.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={chat.name}
                      primaryTypographyProps={{
                        sx: { fontSize: "0.875rem", fontWeight: 500 },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider variant="inset" component="li" 
                sx={{ borderBottom: "1.33px solid #006F75", flexShrink: 0 }}/>
              </React.Fragment>
            ))}
          </List>
        </Box>
        )}

        {/* CHAT WINDOW */}
        {type === "chat" && selectedChat && (
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
            
            {/* CHAT HEADER */}
            <Box sx={{ borderBottom: "1.33px solid #006F75", flexShrink: 0 }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ border: "1.34px solid #006F75"}} src={selectedChat.avatar} />
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
              }}
            >
              {messages.map((msg) => (
                <React.Fragment key={msg.id}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.73rem",
                      fontWeight: 1000,
                      alignSelf: msg.message_type === "send" ? "flex-end" : "flex-start",
                    }}
                  >
                    {msg.message_type === "send" ? "You" : selectedChat?.name}
                  </Typography>
                  <Box
                  sx={{
                    alignSelf: msg.message_type === "send" ? "flex-end" : "flex-start",
                    bgcolor: msg.message_type === "send" ? "#1479DE" : "#2D909C",
                    color: msg.message_type === "send" ? "#fff" : "#fff",
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.75,
                    maxWidth: "80%",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.8rem",fontWeight: 600 }}
                  >
                    {msg.message}
                  </Typography>

                  {msg.message_type === "send" && (
                    <Typography
                      variant="caption"
                      sx={{ mt: 0.25, opacity: 0.7, display: "flex", fontWeight: "1000", gap: 1 }}
                    >
                        <Typography sx={{ fontSize: "0.70rem" }}>{formatTime(msg.createdAt)}</Typography>
                        <Typography sx={{ fontSize: "0.70rem", fontWeight: "1000" }}>
                          {msg.is_read ? <span style={{ color: "#39F525" }}>✔✔</span> : <span style={{ color: "#EBEBEB" }}>✔✔</span>}
                        </Typography>
                    </Typography>
                  )}
                </Box>
              </React.Fragment>
              ))}
            </Box>

            {/* MESSAGE INPUT */}
            <Box sx={{ p: 1, borderTop: "1px solid #006F75", flexShrink: 0 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {borderColor: "#006F75", borderWidth: "1.5px",
                    transition: "border-color 0.3s ease",},
                    "&:hover fieldset": {borderColor: "#22c55e"},
                    "&.Mui-focused fieldset": {borderColor: "#16a34a"},
                  },
                }}
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
                  borderRadius: 2,
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
