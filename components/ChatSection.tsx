"use client";

import { chatList, messages, notifications } from "@/data/rightSideDrawer";
import type { Chat } from "@/types/rightSideDrawer";
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
import React, { useState } from "react";

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

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setNewMessage("");
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
      <Box
        sx={{
          width: 300,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
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
              <IconButton
                size="small"
                onClick={() => setSelectedChat(null)}
                sx={{ ml: 0.5 }}
              >
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
                      secondary={chat.message}
                      primaryTypographyProps={{
                        sx: { fontSize: "0.875rem", fontWeight: 500 },
                      }}
                      secondaryTypographyProps={{
                        sx: { fontSize: "0.75rem", color: "text.secondary" },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}

        {type === "chat" && selectedChat && (
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
                    alignSelf: msg.sender === "me" ? "flex-end" : "flex-start",
                    bgcolor: msg.sender === "me" ? "#1976d2" : "#f1f1f1",
                    color: msg.sender === "me" ? "#fff" : "#000",
                    px: 1.5,
                    py: 0.75,
                    maxWidth: "80%",
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                    {msg.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.25,
                      opacity: 0.7,
                      fontSize: "0.65rem",
                    }}
                  >
                    {msg.time}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ p: 1, borderTop: "1px solid #ddd" }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                InputProps={{
                  sx: { fontSize: "0.8rem" },
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

        {type === "notification" && (
          <List sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            {notifications.map((notif) => (
              <Box
                key={notif.id}
                sx={{
                  bgcolor: "#f8f8f8",
                  p: 1.8,
                  mb: 2,
                  boxShadow: "0px 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.9rem",
                    color: "text.primary",
                    mb: notif.link ? 1 : 0,
                  }}
                >
                  {notif.message}
                </Typography>

                {notif.link && (
                  <Typography
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="body2"
                    sx={{
                      color: "#1976d2",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                      wordBreak: "break-word",
                    }}
                  >
                    {notif.link}
                  </Typography>
                )}
              </Box>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default ChatSection;
