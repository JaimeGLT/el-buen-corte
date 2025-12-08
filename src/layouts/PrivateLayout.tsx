import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import StackAIChatContainer from "../components/StackAIChatContainer";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ScissorsLoader } from "../components/ScissorsLoader";
import type { UserType } from "../types/User";

interface PrivateLayoutProps {
  user: UserType | null;
  loading: boolean;
  error: any;
}

export default function PrivateLayout({ user, loading, error }: PrivateLayoutProps) {


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
          <Sidebar user={user} loading={loading} />

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
