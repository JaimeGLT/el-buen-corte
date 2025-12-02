// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Send, Bot, User, MessageCircle, EllipsisVertical, Maximize2, Minimize2,
//   X, Plus, Paperclip, Settings, HelpCircle, LayoutDashboard, Truck, Calendar
// } from 'lucide-react';
// import { useChatIA } from '../hooks/useChatIA';
// import toast from 'react-hot-toast';

// interface ChatIAProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// // DEFINIMOS LOS BOTONES RÁPIDOS AQUÍ
// const SUGGESTED_ACTIONS = [
//   { label: 'Negocio', icon: <LayoutDashboard size={14} />, prompt: 'Dame un resumen del negocio' },
//   { label: 'Logística', icon: <Truck size={14} />, prompt: '¿Cómo está el stock e inventario?' },
//   { label: 'Agenda', icon: <Calendar size={14} />, prompt: '¿Qué citas tengo pendientes?' },
// ];

// const ChatIA: React.FC<ChatIAProps> = ({ isOpen, onClose }) => {
//   const [inputText, setInputText] = useState('');
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const { messages, isLoading, sendMessage, clearMessages } = useChatIA();

//   const chatRef = useRef<HTMLDivElement>(null);
//   const menuRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // Auto-scroll
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isLoading]);

//   // Click outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [menuOpen]);

//   const handleSend = () => {
//     if (!inputText.trim()) return;
//     sendMessage(inputText);
//     setInputText('');
//   };

//   const handleNewChat = () => {
//     clearMessages(); // Limpia el array de mensajes en el hook
//     setInputText(''); // Limpia el input por si acaso
//     // Opcional: Cerrar el menú si se disparó desde ahí
//     if (menuOpen) setMenuOpen(false);
//     toast.success('Nueva conversación iniciada');
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   // ESTA FUNCIÓN MANEJA LOS CLICS EN LOS BOTONES
//   const handleChipClick = (prompt: string) => {
//     sendMessage(prompt);
//   };

//   if (!isOpen) return null;

//   return (
//     <div
//       ref={chatRef}
//       className={`fixed bottom-4 right-4 z-50 flex flex-col border border-gray-200 shadow-2xl rounded-xl bg-white transition-all duration-300 ease-in-out font-sans
//       ${isExpanded ? 'w-[80vw] h-[80vh]' : 'w-96 h-[600px]'}`}
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center px-4 py-3 border-b rounded-t-xl bg-gradient-to-r from-[#ff8b8b] to-[#ff6b6b] text-white shadow-md">
//         <div className="flex items-center space-x-2">
//           <div className="p-1 bg-white/20 rounded-full">
//              <MessageCircle size={20} />
//           </div>
//           <h2 className="text-lg font-bold tracking-wide">Asistente ERP</h2>
//         </div>

//         <div className="relative" ref={menuRef}>
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="p-1.5 rounded-full hover:bg-white/20 transition cursor-pointer"
//           >
//             <EllipsisVertical size={20} />
//           </button>

//           {menuOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
//                {/* Opciones del menú (Simplificadas para brevedad) */}
//                <button onClick={() => setIsExpanded(!isExpanded)} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-sm">
//                   {isExpanded ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
//                   <span>{isExpanded ? 'Minimizar' : 'Maximizar'}</span>
//                </button>
//                <button onClick={handleNewChat} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-sm">
//                   <Plus size={16}/> <span>Nuevo Chat</span>
//                </button>
//                <div className="h-px bg-gray-100 my-1"></div>
//                <button onClick={onClose} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center space-x-2 text-sm">
//                   <X size={16}/> <span>Cerrar</span>
//                </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
//         {messages.length === 0 && (
//           <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
//             <div className="bg-white p-4 rounded-full shadow-sm mb-2">
//                 <Bot className="text-[#ff8b8b]" size={40} />
//             </div>
//             <p className="font-medium text-gray-600">¿En qué te ayudo hoy?</p>
            
//             {/* SUGERENCIAS INICIALES (BOTONES) */}
//             <div className="grid grid-cols-1 gap-2 w-full max-w-xs px-4">
//               {SUGGESTED_ACTIONS.map((action, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => handleChipClick(action.prompt)}
//                   className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-[#ff8b8b] hover:shadow-md transition-all group text-left"
//                 >
//                   <div className="p-2 bg-gray-50 rounded-lg text-gray-600 group-hover:text-[#ff8b8b] group-hover:bg-red-50 transition-colors">
//                     {action.icon}
//                   </div>
//                   <span className="text-sm font-medium text-gray-700">{action.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {messages.map((msg) => (
//           <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//             <div className={`flex items-end space-x-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              
//               {/* Avatar */}
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 ${
//                 msg.sender === 'user' ? 'bg-[#ff8b8b]' : 'bg-white border border-gray-100'
//               }`}>
//                 {msg.sender === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-[#ff8b8b]" />}
//               </div>

//               {/* Bubble */}
//               <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
//                 msg.sender === 'user' 
//                   ? 'bg-[#ff8b8b] text-white rounded-br-none' 
//                   : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
//               }`}>
//                 {msg.text}
//               </div>
//             </div>
//           </div>
//         ))}

//         {isLoading && (
//            <div className="flex justify-start">
//              <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm ml-10">
//                <div className="flex space-x-1">
//                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//                </div>
//              </div>
//            </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="p-3 bg-white border-t border-gray-100">
        
//         {/* CHIPS FLOTANTES (Opcional, si quieres botones persistentes encima del input) */}
//         {messages.length > 0 && !isLoading && (
//             <div className="flex space-x-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
//                 {SUGGESTED_ACTIONS.map((action, idx) => (
//                     <button
//                         key={idx}
//                         onClick={() => handleChipClick(action.prompt)}
//                         className="flex-shrink-0 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:bg-[#ff8b8b] hover:text-white hover:border-[#ff8b8b] transition-colors"
//                     >
//                         {action.label}
//                     </button>
//                 ))}
//             </div>
//         )}

//         <div className="flex items-end space-x-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:border-[#ff8b8b] focus-within:ring-1 focus-within:ring-[#ff8b8b] transition-all">
//           <button onClick={handleNewChat} className="p-2 text-gray-400 hover:text-gray-600 transition" title="Limpiar chat">
//              <Plus size={20} />
//           </button>
          
//           <textarea
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             onKeyDown={(e) => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSend();
//                 }
//             }}
//             placeholder="Pregunta sobre stock, ventas o agenda..."
//             className="flex-1 max-h-32 bg-transparent border-none focus:ring-0 text-sm py-2 resize-none text-gray-700 placeholder-gray-400"
//             rows={1}
//             disabled={isLoading}
//           />
          
//           <button
//             onClick={handleSend}
//             disabled={isLoading || !inputText.trim()}
//             className={`p-2 rounded-lg transition-all shadow-sm ${
//                 isLoading || !inputText.trim() 
//                 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
//                 : 'bg-[#ff8b8b] text-white hover:bg-[#ff6b6b] hover:scale-105 active:scale-95'
//             }`}
//           >
//             <Send size={18} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatIA;