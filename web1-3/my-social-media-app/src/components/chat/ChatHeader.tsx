import type { Chat } from "../../types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { MoreVertical, Search, Phone, Menu } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";

interface ChatHeaderProps {
  chat: Chat;
}

const ChatHeader = ({ chat }: ChatHeaderProps) => {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button className="md:hidden mr-2" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <Avatar>
          <AvatarImage src={chat.avatar} alt={chat.name} />
          <AvatarFallback>{chat.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{chat.name}</p>
          <p className="text-sm text-gray-500">online</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Phone size={20} />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <Search size={20} />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader; 