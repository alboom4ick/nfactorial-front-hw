import ChatListItem from "./ChatListItem";
import { Search } from 'lucide-react';
import { useState } from "react";
import type { Chat } from "@/types";

interface SidebarProps {
  chats: Chat[];
}

const Sidebar = ({ chats }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border-r border-gray-200 w-80 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold">Telegram Clone</h1>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search chats"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-blue"
          />
        </div>
      </div>
      <div className="flex-1 p-2 space-y-1">
        {filteredChats.map((chat) => (
          <ChatListItem key={chat.id} chat={chat} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;