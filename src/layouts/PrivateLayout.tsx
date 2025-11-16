import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatIA from "../components/ChatIA";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { BotMessageSquare } from "lucide-react";


export default function PrivateLayout() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 bg-gray-100 overflow-auto relative">
        <Toaster />

        {/* Aquí se renderiza cada página */}
        <Outlet />

        {/* Chat IA flotante */}
        <>
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-4 right-4 bg-primary-bg text-white p-3 rounded-full shadow-lg hover:bg-[#ff8b8b] transition-colors z-40 cursor-pointer"
            title="Preguntar a IA"
          >
            <BotMessageSquare size={30} />
          </button>


          <ChatIA isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
      </div>
    </div>
  );
}
