const HomePage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Select a chat to start messaging
          </h2>
          <p className="text-gray-500">or create a new one.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 