import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
// import ChatIA from "../components/ChatIA";
import StackAIChatContainer from "../components/StackAIChatContainer";
import { useEffect } from "react";
// import { useState } from "react";
import { Toaster } from "react-hot-toast";
// import { BotMessageSquare } from "lucide-react";
import { getHook } from "../hooks/getHook";
import { ScissorsLoader } from "../components/ScissorsLoader";
import type { UserType } from "../types/User";

export default function PrivateLayout() {
  // const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: user, loading, error } = getHook<UserType>("/me");

  const navigate = useNavigate();
  useEffect(() => {
    if (error) navigate("/login");
  }, [error]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fijo */}
      {loading ? (
        <div className="h-full flex w-full items-center justify-center">
          <ScissorsLoader />
        </div>
      ) : (
        <>
          <Sidebar user={user} />

          <div className="flex-1 bg-gray-100 overflow-auto relative">
            <Toaster />

            {/* Aquí se renderiza cada página */}
            <Outlet />

            {/*
            <>
              <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-4 right-4 bg-primary-bg text-white p-3 rounded-full shadow-lg hover:bg-[#ff8b8b] transition-colors z-40 cursor-pointer"
                title="Preguntar a IA (ChatIA)"
              >
                <BotMessageSquare size={30} />
              </button>

              <ChatIA
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
              />
            </>
            */}

            {/* CHAT StackAI (widget) */}
            <StackAIChatContainer />
          </div>
        </>
      )}
    </div>
  );
}
