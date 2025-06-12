import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { mockChats } from "./lib/mock-data";
import type { Chat } from "./types";
import { SidebarProvider } from "./context/SidebarContext";
import ChatPage from "./pages/ChatPage";

function App() {
  const [chats, setChats] = useLocalStorage<Chat[]>("chats", mockChats);

  return (
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<Layout chats={chats} />}>
          <Route index element={<HomePage />} />
          <Route path="chat/:chatId" element={<ChatPage chats={chats} setChats={setChats} />} />
        </Route>
      </Routes>
    </SidebarProvider>
  );
}

export default App;
