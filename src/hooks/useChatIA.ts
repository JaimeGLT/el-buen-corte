import { useState, useCallback } from 'react';
import { type Message } from '../types/chatTypes'; // O donde guardes los tipos
import toast from 'react-hot-toast';

export const useChatIA = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Función para enviar mensaje a tu Spring Boot
  const sendMessage = useCallback(async (text: string) => {
    // 1. Añadir mensaje del usuario inmediatamente a la UI
    const userMsg: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. LLAMADA AL BACKEND (El GET que arreglamos)
      // Usamos encodeURIComponent para evitar problemas con espacios y caracteres raros
      const response = await fetch(`http://localhost:8080/api/v1/gemini/consultar?prompt=${encodeURIComponent(text)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error en la conexión con el servidor');
      }

      const data = await response.json();

      // 3. Añadir respuesta del Bot
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.respuesta, // Aquí mapeamos el JSON que devuelve Java: { "respuesta": "..." }
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      console.error('Error:', error);
      toast.error('No pude conectar con el servidor.');
      
      // Mensaje de error en el chat (opcional)
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, hubo un error de conexión. Intenta de nuevo.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = () => setMessages([]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
};