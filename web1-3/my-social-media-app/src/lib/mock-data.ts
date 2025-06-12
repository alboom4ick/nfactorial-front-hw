import type { Chat } from '../types';

export const mockChats: Chat[] = [
  {
    id: '1',
    type: 'user',
    name: 'Alice',
    avatar: 'https://i.pravatar.cc/150?u=alice',
    messages: [
      { id: '1', sender: 'them', content: 'Hey, how are you?', timestamp: '10:25', status: 'read' },
      { id: '2', sender: 'me', content: 'I am good, thanks! How about you?', timestamp: '10:26', status: 'read' },
      { id: '3', sender: 'them', content: 'Doing great! Just finished a project.', timestamp: '10:27', status: 'read' },
      { id: '4', sender: 'me', content: 'Awesome! Congrats!', timestamp: '10:28', status: 'delivered' },
    ],
    lastMessage: 'Awesome! Congrats!',
    lastMessageTime: '10:28',
    unreadCount: 0,
  },
  {
    id: '2',
    type: 'bot',
    name: 'AI Assistant',
    avatar: 'https://i.pravatar.cc/150?u=ai-assistant',
    messages: [
      { id: '1', sender: 'me', content: 'What is React?', timestamp: '10:20', status: 'read' },
      { id: '2', sender: 'them', content: 'React is a JavaScript library for building user interfaces.', timestamp: '10:21', status: 'read' },
    ],
    lastMessage: 'React is a JavaScript library for building user interfaces.',
    lastMessageTime: '10:21',
    unreadCount: 0,
  },
  {
    id: '3',
    type: 'user',
    name: 'Bob',
    avatar: 'https://i.pravatar.cc/150?u=bob',
    messages: [],
    lastMessage: 'See you tomorrow!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
  },
  {
    id: '4',
    type: 'user',
    name: 'Charlie',
    avatar: 'https://i.pravatar.cc/150?u=charlie',
    messages: [],
    lastMessage: 'Thanks!',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
  },
]; 