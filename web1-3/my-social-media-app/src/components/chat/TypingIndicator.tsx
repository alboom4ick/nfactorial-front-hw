export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-fast"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-medium"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse-slow"></div>
    </div>
  );
}; 