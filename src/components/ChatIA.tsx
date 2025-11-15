import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  MessageCircle,
  EllipsisVertical,
  Maximize2,
  Minimize2,
  X,
  Plus,
  Paperclip,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useChatIA } from '../hooks/useChatIA';
import toast from 'react-hot-toast';

interface ChatIAProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatIA: React.FC<ChatIAProps> = ({ isOpen, onClose }) => {
  const [inputText, setInputText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { messages, isLoading, sendMessage, clearMessages } = useChatIA();

  const chatRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cerrar chat al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        onClose();
      }
      // Cerrar menú si se clickea fuera
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    clearMessages();
    setInputText('');
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleMenuClick = (action: string) => {
    switch (action) {
      case 'close':
        onClose();
        break;
      case 'maximize':
        setIsExpanded(true);
        break;
      case 'minimize':
        setIsExpanded(false);
        break;
      case 'config':
        toast('Abrir configuración');
        break;
      case 'help':
        toast('Abrir ayuda');
        break;
    }
    setMenuOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={chatRef}
      className={`fixed bottom-4 right-4 z-50 flex flex-col border border-gray-200 shadow-2xl rounded-xl bg-white transition-all
      ${isExpanded ? 'w-[80%] h-[80%]' : 'w-96 h-[500px]'}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b rounded-t-xl bg-[#ff8b8b] text-white shadow-md relative">
        <div className="flex items-center space-x-2">
          <MessageCircle size={20} />
          <h2 className="text-lg font-semibold">Chat IA</h2>
        </div>

        {/* Menú de opciones */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded hover:bg-white/20 transition cursor-pointer"
            title="Opciones"
          >
            <EllipsisVertical size={20} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg z-50 overflow-hidden">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => handleMenuClick('close')}
              >
                <X size={16} />
                <span>Cerrar</span>
              </button>

              {/* Mostrar solo la acción relevante según el estado */}
              {!isExpanded && (
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                  onClick={() => handleMenuClick('maximize')}
                >
                  <Maximize2 size={16} />
                  <span>Maximizar</span>
                </button>
              )}
              {isExpanded && (
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                  onClick={() => handleMenuClick('minimize')}
                >
                  <Minimize2 size={16} />
                  <span>Minimizar</span>
                </button>
              )}

              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => handleMenuClick('config')}
              >
                <Settings size={16} />
                <span>Configuración</span>
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                onClick={() => handleMenuClick('help')}
              >
                <HelpCircle size={16} />
                <span>Ayuda</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8 wrap-break-word">
            <Bot className="mx-auto mb-2" size={48} />
            <p>¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte hoy?</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`p-2 rounded-full shadow-md ${
                  msg.sender === 'user' ? 'bg-[#ff8b8b]' : 'bg-gray-200'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-gray-600" />
                )}
              </div>

              <div
                className={`p-3 rounded-lg shadow-sm wrap-break-word ${
                  msg.sender === 'user'
                    ? 'bg-[#ff8b8b] text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
              <div className="p-2 rounded-full bg-gray-200">
                <Bot size={16} className="text-gray-600 animate-pulse" />
              </div>
              <div className="p-3 rounded-lg bg-gray-200 text-gray-800">
                <p className="text-sm">Pensando...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[#ff8b8b] bg-white rounded-b-xl">
        <div className="flex space-x-2 items-end">
          {/* Nuevo chat */}
          <button
            onClick={handleNewChat}
            className="p-2 rounded-lg cursor-pointer hover:bg-[#ff8b8b] hover:text-white text-gray-700 transition"
            title="Nuevo chat"
          >
            <Plus size={18} />
          </button>

          {/* Textarea */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu pregunta..."
            className="flex-1 p-2 border border-[#ff8b8b] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8b8b] text-sm resize-none"
            disabled={isLoading}
            rows={1}
          />

          {/* Adjuntar */}
          <button
            onClick={handleAttachFile}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
            title="Adjuntar archivo"
          >
            <Paperclip size={18} />
          </button>

          {/* Enviar */}
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className="p-2 rounded-lg bg-[#ff8b8b] text-white hover:bg-[#ff6b6b] transition cursor-pointer disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>

        <input type="file" ref={fileInputRef} className="hidden" />
      </div>
    </div>
  );
};

export default ChatIA;
