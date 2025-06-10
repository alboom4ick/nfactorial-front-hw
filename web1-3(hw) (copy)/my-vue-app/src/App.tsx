import { useState, useEffect } from 'react'
import './App.css'

interface Message {
  id: number
  text: string
  sender: 'me' | 'other'
  timestamp: string
  avatar?: string
}

interface Chat {
  id: number
  name: string
  lastMessage: string
  timestamp: string
  avatar: string
  unreadCount?: number
  online?: boolean
}

// Character system prompts for each chat
const getSystemPrompt = (chatId: number): string => {
  const prompts: Record<number, string> = {
    1: "You are Alice Johnson, a professional business woman (👩‍💼). You work in project management and are friendly, organized, and professional. You often discuss work schedules, meetings, and business topics. Keep responses conversational and under 80 words. Use occasional professional emojis.",
    2: "You are Bob Smith, a software developer (👨‍💻). You're knowledgeable about coding, especially React, JavaScript, and web development. You're helpful with technical questions and like to share coding tips. Keep responses technical but friendly, under 80 words. Use occasional tech emojis.",
    3: "You are representing the Team Chat (👥). Respond as if you're part of a development team. Share updates about sprints, meetings, project progress, and team activities. Be collaborative and team-focused. Keep responses under 80 words. Use team-related emojis.",
    4: "You are Sarah Wilson, a creative designer (👩‍🎨). You work on UI/UX design, graphics, and creative projects. You're artistic, enthusiastic about design trends, and love discussing visual aesthetics. Keep responses creative and friendly, under 80 words. Use design/art emojis.",
    5: "You are a helpful AI assistant for project updates and technical discussions. You provide concise, professional responses about software development, deployments, project management, and technical topics. Keep responses under 100 words and use relevant emojis when appropriate."
  };
  
  // For new chats (not in predefined prompts), use a generic friendly personality
  if (!prompts[chatId]) {
    return "You are a friendly and helpful person. Respond naturally to conversations, be engaging and supportive. Keep responses conversational and under 80 words. Use appropriate emojis to match the tone of the conversation.";
  }
  
  return prompts[chatId];
};

// OpenAI API helper function
const callOpenAI = async (message: string, chatId: number): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      // Check if user might have used OPENAI_API_KEY instead of VITE_OPENAI_API_KEY
      const wrongKey = import.meta.env.OPENAI_API_KEY;
      if (wrongKey) {
        return "⚠️ Please rename OPENAI_API_KEY to VITE_OPENAI_API_KEY in your .env file. Vite requires the VITE_ prefix for client-side environment variables.";
      }
      return "⚠️ OpenAI API key not configured. Please add VITE_OPENAI_API_KEY=your_key_here to your .env file.";
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(chatId)
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 120,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "🔌 Connection error. Please check your API key and internet connection.";
  }
};

function App() {
  const [selectedChatId, setSelectedChatId] = useState<number>(1)
  const [newMessage, setNewMessage] = useState('')
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [newChatName, setNewChatName] = useState('')
  const [newChatAvatar, setNewChatAvatar] = useState('👤')

  // Default conversations data
  const defaultConversations: Record<number, Message[]> = {
    1: [
      {
        id: 1,
        text: 'Hey! How are you doing?',
        sender: 'other',
        timestamp: '2:25 PM',
        avatar: '👩‍💼'
      },
      {
        id: 2,
        text: 'Hi Alice! I\'m doing great, thanks for asking 😊',
        sender: 'me',
        timestamp: '2:27 PM'
      },
      {
        id: 3,
        text: 'That\'s wonderful to hear! Are you free for a quick call later?',
        sender: 'other',
        timestamp: '2:28 PM',
        avatar: '👩‍💼'
      },
      {
        id: 4,
        text: 'Sure! I\'ll be available after 4 PM. What would you like to discuss?',
        sender: 'me',
        timestamp: '2:30 PM'
      }
    ],
    2: [
      {
        id: 1,
        text: 'Could you help me with the React component?',
        sender: 'other',
        timestamp: '1:40 PM',
        avatar: '👨‍💻'
      },
      {
        id: 2,
        text: 'Sure! What specific issue are you facing?',
        sender: 'me',
        timestamp: '1:42 PM'
      },
      {
        id: 3,
        text: 'I\'m having trouble with state management',
        sender: 'other',
        timestamp: '1:43 PM',
        avatar: '👨‍💻'
      },
      {
        id: 4,
        text: 'Let me send you a quick example. One moment...',
        sender: 'me',
        timestamp: '1:44 PM'
      },
      {
        id: 5,
        text: 'Thanks for the help!',
        sender: 'other',
        timestamp: '1:45 PM',
        avatar: '👨‍💻'
      }
    ],
    3: [
      {
        id: 1,
        text: 'Good morning team! 👋',
        sender: 'other',
        timestamp: '9:00 AM',
        avatar: '👥'
      },
      {
        id: 2,
        text: 'Morning! Ready for today\'s sprint planning?',
        sender: 'me',
        timestamp: '9:15 AM'
      },
      {
        id: 3,
        text: 'Yes! I\'ve prepared the backlog items',
        sender: 'other',
        timestamp: '10:30 AM',
        avatar: '👥'
      },
      {
        id: 4,
        text: 'Don\'t forget - Meeting at 3 PM',
        sender: 'other',
        timestamp: '12:30 PM',
        avatar: '👥'
      }
    ],
    4: [
      {
        id: 1,
        text: 'I finished the new design mockups! 🎨',
        sender: 'other',
        timestamp: '10:00 AM',
        avatar: '👩‍🎨'
      },
      {
        id: 2,
        text: 'Awesome! Can you share them with the team?',
        sender: 'me',
        timestamp: '10:30 AM'
      },
      {
        id: 3,
        text: 'Already sent them via email. What do you think?',
        sender: 'other',
        timestamp: '11:00 AM',
        avatar: '👩‍🎨'
      },
      {
        id: 4,
        text: 'They look fantastic! Great work as always',
        sender: 'me',
        timestamp: '11:10 AM'
      },
      {
        id: 5,
        text: 'See you tomorrow!',
        sender: 'other',
        timestamp: '11:15 AM',
        avatar: '👩‍🎨'
      }
    ],
    5: [
      {
        id: 1,
        text: 'Hello! I\'m your AI assistant. I can help you with project updates, technical questions, deployment issues, and more! 🤖',
        sender: 'other',
        timestamp: 'Just now',
        avatar: '🤖'
      },
      {
        id: 2,
        text: 'What can I help you with today?',
        sender: 'other',
        timestamp: 'Just now',
        avatar: '🤖'
      }
    ]
  };

  // Default chats data
  const defaultChats: Chat[] = [
    {
      id: 1,
      name: 'Alice Johnson',
      lastMessage: 'Hey! How are you doing?',
      timestamp: '2:30 PM',
      avatar: '👩‍💼',
      online: true
    },
    {
      id: 2,
      name: 'Bob Smith',
      lastMessage: 'Thanks for the help!',
      timestamp: '1:45 PM',
      avatar: '👨‍💻',
      online: false
    },
    {
      id: 3,
      name: 'Team Chat',
      lastMessage: 'Meeting at 3 PM',
      timestamp: '12:30 PM',
      avatar: '👥',
      online: true
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      lastMessage: 'See you tomorrow!',
      timestamp: '11:15 AM',
      avatar: '👩‍🎨',
      online: true
    },
    {
      id: 5,
      name: 'AI Assistant',
      lastMessage: 'Ask me anything about your projects!',
      timestamp: 'Online',
      avatar: '🤖',
      online: true
    }
  ];

  // Load conversations from localStorage or use default
  const loadConversationsFromStorage = (): Record<number, Message[]> => {
    try {
      const stored = localStorage.getItem('chatConversations');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading conversations from localStorage:', error);
    }
    return defaultConversations;
  };

  // Load chats from localStorage or use default
  const loadChatsFromStorage = (): Chat[] => {
    try {
      const stored = localStorage.getItem('chatsList');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading chats from localStorage:', error);
    }
    return defaultChats;
  };

  // Load unread counts from localStorage or use default
  const loadUnreadCountsFromStorage = (): Record<number, number> => {
    try {
      const stored = localStorage.getItem('chatUnreadCounts');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading unread counts from localStorage:', error);
    }
    // Default unread counts
    return {
      1: 2,
      2: 0, 
      3: 5,
      4: 0,
      5: 0
    };
  };

  // Separate conversations for each chat with localStorage persistence
  const [conversations, setConversations] = useState<Record<number, Message[]>>(loadConversationsFromStorage);
  
  // Dynamic chats list with localStorage persistence
  const [chats, setChats] = useState<Chat[]>(loadChatsFromStorage);
  
  // Unread message counts with localStorage persistence
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>(loadUnreadCountsFromStorage);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('chatConversations', JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversations to localStorage:', error);
    }
  }, [conversations]);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('chatsList', JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chats to localStorage:', error);
    }
  }, [chats]);

  // Save unread counts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('chatUnreadCounts', JSON.stringify(unreadCounts));
    } catch (error) {
      console.error('Error saving unread counts to localStorage:', error);
    }
  }, [unreadCounts]);

  const selectedChat = chats.find(chat => chat.id === selectedChatId)
  const currentMessages = conversations[selectedChatId] || []

  // Get dynamic chats with unread counts
  const chatsWithUnreadCounts = chats.map(chat => ({
    ...chat,
    unreadCount: unreadCounts[chat.id] || 0
  }));

  // Function to create a new chat
  const createNewChat = () => {
    if (!newChatName.trim()) return;

    const newChatId = Math.max(...chats.map(c => c.id), 0) + 1;
    const newChat: Chat = {
      id: newChatId,
      name: newChatName.trim(),
      lastMessage: 'Start a conversation...',
      timestamp: 'Now',
      avatar: newChatAvatar,
      online: true
    };

    // Add new chat to the list
    setChats(prev => [...prev, newChat]);

    // Initialize empty conversation for the new chat
    setConversations(prev => ({
      ...prev,
      [newChatId]: []
    }));

    // Initialize unread count for the new chat
    setUnreadCounts(prev => ({
      ...prev,
      [newChatId]: 0
    }));

    // Clear form and close modal
    setNewChatName('');
    setNewChatAvatar('👤');
    setShowNewChatModal(false);

    // Select the new chat
    setSelectedChatId(newChatId);
  };

  // Available avatars for new chats
  const availableAvatars = [
    '👤', '👨', '👩', '👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', 
    '👨‍🎨', '👩‍🎨', '👨‍🔬', '👩‍🔬', '👨‍🏫', '👩‍🏫',
    '🧑‍💼', '🧑‍💻', '🧑‍🎨', '🧑‍🔬', '🧑‍🏫', '👥', '🤖'
  ];

  // Function to get the last message for a chat
  const getLastMessage = (chatId: number): string => {
    const chatMessages = conversations[chatId] || [];
    if (chatMessages.length === 0) {
      // Fallback to original message if no messages exist
      const chat = chats.find(c => c.id === chatId);
      return chat?.lastMessage || '';
    }
    
    const lastMessage = chatMessages[chatMessages.length - 1];
    // Truncate long messages for preview
    return lastMessage.text.length > 50 
      ? lastMessage.text.substring(0, 50) + '...' 
      : lastMessage.text;
  }

  // Function to get the last message timestamp
  const getLastMessageTime = (chatId: number): string => {
    const chatMessages = conversations[chatId] || [];
    if (chatMessages.length === 0) {
      // Fallback to original timestamp if no messages exist
      const chat = chats.find(c => c.id === chatId);
      return chat?.timestamp || '';
    }
    
    const lastMessage = chatMessages[chatMessages.length - 1];
    return lastMessage.timestamp;
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChatId) {
      const message: Message = {
        id: currentMessages.length + 1,
        text: newMessage,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }
      
      // Add user message immediately
      setConversations(prev => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), message]
      }))
      
      const userMessage = newMessage;
      setNewMessage('')

      // All chats now use AI responses
      setIsAiTyping(true);
      
      try {
        const aiResponse = await callOpenAI(userMessage, selectedChatId);
        const responseMessage: Message = {
          id: currentMessages.length + 2,
          text: aiResponse,
          sender: 'other',
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          avatar: selectedChat?.avatar
        }

        setConversations(prev => ({
          ...prev,
          [selectedChatId]: [...(prev[selectedChatId] || []), responseMessage]
        }))
      } catch (error) {
        console.error('AI Response Error:', error);
        const errorMessage: Message = {
          id: currentMessages.length + 2,
          text: '🔧 Sorry, I encountered an error. Please try again.',
          sender: 'other',
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          avatar: selectedChat?.avatar
        }

        setConversations(prev => ({
          ...prev,
          [selectedChatId]: [...(prev[selectedChatId] || []), errorMessage]
        }))
      } finally {
        setIsAiTyping(false);
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleChatSelect = (chatId: number) => {
    setSelectedChatId(chatId)
    setNewMessage('') // Clear input when switching chats
    
    // Clear unread count for the selected chat
    setUnreadCounts(prev => ({
      ...prev,
      [chatId]: 0
    }))
  }

  // Get typing status text based on chat
  const getTypingStatus = () => {
    if (!isAiTyping) {
      return selectedChatId === 5 ? 'AI Assistant Online' : (selectedChat?.online ? 'Online' : 'Last seen recently')
    }
    
    const typingTexts = {
      1: 'Alice is typing...',
      2: 'Bob is typing...',
      3: 'Team is typing...',
      4: 'Sarah is typing...',
      5: 'AI is typing...'
    }
    return typingTexts[selectedChatId as keyof typeof typingTexts] || 'Typing...'
  }

  // Function to simulate receiving a message in another chat (for testing unread counts)
  const simulateIncomingMessage = (chatId: number) => {
    if (chatId === selectedChatId) return; // Don't add unread if chat is currently open

    const simulatedMessages = [
      "Hey, just wanted to check in!",
      "Did you see my last message?",
      "Hope you're having a great day!",
      "Quick question when you have time",
      "Thanks for your help earlier!"
    ];

    const randomMessage = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];
    const chatData = chats.find(c => c.id === chatId);
    
    const newMessage: Message = {
      id: (conversations[chatId] || []).length + 1,
      text: randomMessage,
      sender: 'other',
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      avatar: chatData?.avatar
    };

    // Add message to conversation
    setConversations(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage]
    }));

    // Increment unread count
    setUnreadCounts(prev => ({
      ...prev,
      [chatId]: (prev[chatId] || 0) + 1
    }));
  };

  return (
    <div className="chat-app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="text-white text-xl font-medium mb-4">Chats</h2>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full py-2.5 px-4 border-none rounded-2xl bg-white bg-opacity-20 text-white text-sm outline-none placeholder-white placeholder-opacity-70 focus:bg-opacity-30 transition-all"
            />
          </div>
        </div>
        
        {/* New Chat Button */}
        <div className="p-5 border-b border-gray-200">
          <button 
            onClick={() => setShowNewChatModal(true)}
            className="w-full py-2.5 px-4 bg-telegram-blue text-white border-none rounded-lg cursor-pointer text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            ➕ New Chat
          </button>
        </div>
        
        <div className="chat-list">
          {chatsWithUnreadCounts.map(chat => (
            <div 
              key={chat.id}
              className={`chat-item ${selectedChatId === chat.id ? 'active' : ''}`}
              onClick={() => handleChatSelect(chat.id)}
            >
              <div className="chat-avatar">
                <span className="avatar-emoji">{chat.avatar}</span>
                {chat.online && <div className="online-indicator"></div>}
              </div>
              <div className="chat-info">
                <div className="chat-name">{chat.name}</div>
                <div className="chat-last-message">{getLastMessage(chat.id)}</div>
              </div>
              <div className="chat-meta">
                <div className="chat-timestamp">{getLastMessageTime(chat.id)}</div>
                {(chat.unreadCount || 0) > 0 && (
                  <div className="unread-badge">{chat.unreadCount}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl w-96 max-w-[90vw]">
            <h3 className="m-0 mb-5 text-gray-800 text-lg font-semibold">Create New Chat</h3>
            
            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-700">
                Contact Name
              </label>
              <input
                type="text"
                value={newChatName}
                onChange={(e) => setNewChatName(e.target.value)}
                placeholder="Enter contact name..."
                className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:border-telegram-blue focus:ring-1 focus:ring-telegram-blue"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    createNewChat();
                  }
                }}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700">
                Choose Avatar
              </label>
              <div className="grid grid-cols-8 gap-2 max-h-30 overflow-y-auto border border-gray-300 rounded-lg p-2.5">
                {availableAvatars.map(avatar => (
                  <button
                    key={avatar}
                    onClick={() => setNewChatAvatar(avatar)}
                    className={`w-9 h-9 rounded-md cursor-pointer text-lg flex items-center justify-center transition-all ${
                      newChatAvatar === avatar 
                        ? 'border-2 border-telegram-blue bg-blue-50' 
                        : 'border border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setNewChatName('');
                  setNewChatAvatar('👤');
                }}
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-white cursor-pointer text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewChat}
                disabled={!newChatName.trim()}
                className={`flex-1 p-3 border-none rounded-lg text-white text-sm font-medium transition-colors ${
                  newChatName.trim() 
                    ? 'bg-telegram-blue cursor-pointer hover:bg-blue-600' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Create Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="main-chat">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar">
                  <span className="avatar-emoji">{selectedChat.avatar}</span>
                  {selectedChat.online && <div className="online-indicator"></div>}
                </div>
                <div>
                  <div className="chat-header-name">{selectedChat.name}</div>
                  <div className="chat-header-status text-telegram-blue">
                    {getTypingStatus()}
                  </div>
                </div>
              </div>
              <div className="chat-header-actions flex gap-2">
                {selectedChatId !== 5 && (
                  <>
                    <button className="action-btn hover:bg-gray-100 transition-colors rounded-full p-2">📞</button>
                    <button className="action-btn hover:bg-gray-100 transition-colors rounded-full p-2">📹</button>
                  </>
                )}
                <button 
                  className="action-btn hover:bg-gray-100 transition-colors rounded-full p-2" 
                  onClick={() => {
                    // Simulate incoming message from a random other chat
                    const otherChats = chatsWithUnreadCounts.filter(c => c.id !== selectedChatId);
                    const randomChat = otherChats[Math.floor(Math.random() * otherChats.length)];
                    simulateIncomingMessage(randomChat.id);
                  }}
                  title="Simulate incoming message (test unread counts)"
                >
                  📧
                </button>
                <button className="action-btn hover:bg-gray-100 transition-colors rounded-full p-2">⋮</button>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-container">
              {currentMessages.map(message => (
                <div 
                  key={message.id}
                  className={`message ${message.sender === 'me' ? 'sent' : 'received'}`}
                >
                  {message.sender === 'other' && (
                    <div className="message-avatar">
                      <span className="avatar-emoji">{message.avatar}</span>
                    </div>
                  )}
                  <div className="message-content">
                    <div className="message-text">{message.text}</div>
                    <div className="message-timestamp">{message.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="message-input-container">
              <div className="message-input">
                {selectedChatId !== 5 && <button className="attachment-btn hover:bg-gray-200 transition-colors rounded-full">📎</button>}
                <input
                  type="text"
                  placeholder={selectedChatId === 5 ? "Ask me anything..." : `Type a message to ${selectedChat.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isAiTyping}
                  className="flex-1 border-none bg-transparent outline-none text-base py-2 placeholder-gray-500 disabled:opacity-50"
                />
                {selectedChatId !== 5 && <button className="emoji-btn hover:bg-gray-200 transition-colors rounded-full">😊</button>}
                <button 
                  className={`send-btn transition-colors ${isAiTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isAiTyping}
                >
                  {isAiTyping ? '⏳' : '➤'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a chat to start messaging</h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
