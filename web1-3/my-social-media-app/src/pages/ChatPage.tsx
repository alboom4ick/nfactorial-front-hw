import { useParams } from "react-router-dom";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import { useEffect, useState } from "react";
import type { Chat, Message } from "../types";

interface ChatPageProps {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
}

const ChatPage = ({ chats, setChats }: ChatPageProps) => {
  const { chatId } = useParams<{ chatId: string }>();
  const [chat, setChat] = useState<Chat | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const currentChat = chats.find((c) => c.id === chatId);
    setChat(currentChat);
    setMessages(currentChat?.messages || []);
  }, [chatId, chats]);

  const handleSendMessage = (content: string) => {
    if (!chat) return;

    const newMessage: Message = {
      id: `${messages.length + 1}`,
      sender: 'me',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    const updatedChats = chats.map((c) =>
      c.id === chatId
        ? {
            ...c,
            messages: updatedMessages,
            lastMessage: content,
            lastMessageTime: newMessage.timestamp,
          }
        : c
    );
    setChats(updatedChats);

    if (chat.type === 'bot') {
      setIsTyping(true);
      setTimeout(() => {
        const aiResponse: Message = {
          id: `${updatedMessages.length + 1}`,
          sender: 'them',
          content: `This is a simulated AI response to: "${content}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
        };
        const finalMessages = [...updatedMessages, aiResponse];
        setMessages(finalMessages);
        const finalChats = updatedChats.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: finalMessages,
                lastMessage: aiResponse.content,
                lastMessageTime: aiResponse.timestamp,
              }
            : c
        );
        setChats(finalChats);
        setIsTyping(false);
      }, 2000);
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Select a chat to start messaging
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bg-secondary">
      <ChatHeader chat={chat} />
      <MessageList messages={messages} isTyping={isTyping} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatPage; 