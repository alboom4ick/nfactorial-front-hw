import type { Message } from "../../types";
import clsx from "clsx";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isOutgoing = message.sender === 'me';

  const statusIcon = {
    sent: <Check size={16} className="text-gray-400" />,
    delivered: <CheckCheck size={16} className="text-gray-400" />,
    read: <CheckCheck size={16} className="text-blue-500" />,
  };

  return (
    <div className={clsx("flex", isOutgoing ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-md rounded-2xl px-4 py-2",
          isOutgoing
            ? "bg-message-out rounded-br-md"
            : "bg-message-in rounded-bl-md shadow-sm"
        )}
      >
        <p>{message.content}</p>
        <div className="flex items-center justify-end mt-1">
          <span className="text-xs text-gray-400 mr-2">{message.timestamp}</span>
          {isOutgoing && statusIcon[message.status]}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 