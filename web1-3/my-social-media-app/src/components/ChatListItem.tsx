import type { Chat } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

interface ChatListItemProps {
  chat: Chat;
}

const ChatListItem = ({ chat }: ChatListItemProps) => {
  return (
    <Link to={`/chat/${chat.id}`} className="block">
      <div className="flex items-center p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
        <Avatar>
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback>{chat.name[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-4 flex-1">
          <p className="font-semibold">{chat.name}</p>
          <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
        </div>
        <div className="text-xs text-gray-400">{chat.lastMessageTime}</div>
        {chat.unreadCount > 0 && (
          <div className="ml-2 w-5 h-5 bg-primary-blue text-white text-xs flex items-center justify-center rounded-full">
            {chat.unreadCount}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ChatListItem; 