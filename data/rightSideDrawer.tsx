import type { Chat, Message, Notification } from "@/types/rightSideDrawer";


export const chatList: Chat[] = [
  {
    id: 1,
    name: "Albert Flores",
    message: "Hello! Interested in this load?",
    avatar: "/images/a1.png",
  },
  {
    id: 2,
    name: "Darlene Robertson",
    message: "It’s really nice working with you",
    avatar: "/images/a2.png",
  },
  {
    id: 3,
    name: "Guy Hawkins",
    message: "Can we continue to talk?",
    avatar: "/images/a3.png",
  },
  {
    id: 4,
    name: "Ralph Edwards",
    message: "I’m busy yesterday.",
    avatar: "/images/a4.png",
  },
];

export const messages: Message[] = [
  {
    id: 1,
    sender: "them",
    text: "It is a long established fact",
    time: "12/12/2025 - 6:34 pm",
  },
  {
    id: 2,
    sender: "me",
    text: "There are many variations of passages",
    time: "12/12/2025 - 6:34 pm",
  },
  {
    id: 3,
    sender: "them",
    text: "The point of using Lorem Ipsum is...",
    time: "12/12/2025 - 6:34 pm",
  },
];

export const notifications: Notification[] = [
  { id: 1, message: "Your meeting has been scheduled!" },
  {
    id: 2,
    message: "Meeting starts in 20 min — join via the link:",
    link: "sklankfskdfslfdnslds.com",
  },
];
