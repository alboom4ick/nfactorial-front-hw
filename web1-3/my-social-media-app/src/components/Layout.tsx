import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import type { Chat } from "../types";
import { useSidebar } from "../context/SidebarContext";
import clsx from "clsx";

interface LayoutProps {
  chats: Chat[];
}

const Layout = ({ chats }: LayoutProps) => {
  const { isSidebarOpen } = useSidebar();
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/chat');

  return (
    <div className="flex h-screen bg-bg-secondary">
      <div className={clsx(
        "absolute md:relative z-20 md:z-auto transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0"
      )}>
        <Sidebar chats={chats} />
      </div>
      <main className={clsx("flex-1 transition-all duration-300", {
        "md:ml-0": !isSidebarOpen,
        "ml-0": isSidebarOpen
      })}>
        <div className={clsx("h-full", {
          "hidden md:block": isSidebarOpen && isChatPage,
          "block": !isSidebarOpen || !isChatPage
        })}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;