export interface Message {
  id: string;
  sender: 'me' | 'them';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  type: 'user' | 'bot';
  name: string;
  avatar: string;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
} 