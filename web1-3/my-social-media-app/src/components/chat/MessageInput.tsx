import { Send, Paperclip, Mic } from 'lucide-react';
import { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center space-x-4">
      <button className="text-gray-500 hover:text-gray-700">
        <Paperclip size={22} />
      </button>
      <div className="flex-1">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-blue"
        />
      </div>
      <button
        onClick={handleSend}
        className="bg-primary-blue text-white w-10 h-10 rounded-full flex items-center justify-center"
      >
        {message ? <Send size={22} /> : <Mic size={22} />}
      </button>
    </div>
  );
};

export default MessageInput; 