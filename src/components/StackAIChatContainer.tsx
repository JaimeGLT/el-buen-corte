import React, { useState } from "react";
import { Bot, MoreVertical, X, Maximize2, Minimize2 } from "lucide-react";

const StackAIChatContainer: React.FC = () => {
  // --- CONSTANTES DE DISEÑO ---
  const THEME_COLOR = "red";
  const CHAT_URL = "https://www.stack-ai.com/chat/692753d6af8a2a29c0f437a6-7mi9O9SUdaROWAVAee0qDE";

  // --- ESTADOS ---
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // --- HANDLERS ---
  const handleClose = () => {
    setIsOpen(false);
    setShowMenu(false);
  };

  const toggleSize = () => {
    setIsExpanded(!isExpanded);
    setShowMenu(false);
  };

  // Manejadores de eventos de Mouse con tipado explícito para TypeScript
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>, scale: number = 1.0, shadow: string = "none") => {
    e.currentTarget.style.transform = `scale(${scale})`;
    if (shadow !== "none") e.currentTarget.style.boxShadow = shadow;
  };

  // Estilo base para botones del menú para evitar repetición
  const menuButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    background: "white",
    border: "none",
    borderBottom: "1px solid #f3f4f6",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textAlign: "left" as const, // 'as const' es necesario para TS en estilos
    transition: "background-color 0.2s"
  };

  return (
    <>
      {/* 1. BACKDROP (Fondo oscuro) */}
      {isOpen && (
        <div
          onClick={handleClose}
          aria-hidden="true" // Indica a lectores de pantalla que esto es decorativo/funcional
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9998,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            cursor: "default",
          }}
        />
      )}

      {/* CONTENEDOR PRINCIPAL */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          fontFamily: "system-ui, -apple-system, sans-serif", // Fuente segura por defecto
        }}
      >
        {/* 2. VENTANA DEL CHAT */}
        <div
          style={{
            display: isOpen ? "flex" : "none",
            flexDirection: "column",
            width: isExpanded ? "800px" : "450px",
            maxWidth: "90vw",
            height: "660px",
            maxHeight: "100vh",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // Animación más suave
            paddingBottom: "20px",
          }}
        >
          {/* HEADER */}
          <header
            style={{
              height: "56px",
              backgroundColor: THEME_COLOR,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              position: "relative",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              flexShrink: 0, // Evita que el header se aplaste
            }}
          >
            {/* Título e Icono */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Bot size={24} color="white" />
              <span style={{ fontWeight: 600, fontSize: "15px", letterSpacing: "0.5px" }}>
                Asistente El Buen Corte
              </span>
            </div>

            {/* BOTÓN "OPCIONES" */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Opciones del chat"
              title="Opciones"
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <MoreVertical size={20} />
            </button>

            {/* MENÚ DESPLEGABLE */}
            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "50px",
                  right: "10px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  border: "1px solid #f3f4f6",
                  width: "180px",
                  overflow: "hidden",
                  zIndex: 10000,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <button
                  onClick={toggleSize}
                  style={{ ...menuButtonStyle, color: "#4b5563" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                >
                  {isExpanded ? (
                    <> <Minimize2 size={16} /> Minimizar </>
                  ) : (
                    <> <Maximize2 size={16} /> Expandir </>
                  )}
                </button>

                <button
                  onClick={handleClose}
                  style={{ ...menuButtonStyle, color: "#EF4444", borderBottom: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fee2e2")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                >
                  <X size={16} /> Cerrar Chat
                </button>
              </div>
            )}
          </header>

          {/* IFRAME CONTAINER */}
          <div
            style={{ flex: 1, position: "relative", backgroundColor: "#f9fafb" }}
            onClick={() => setShowMenu(false)}
          >
            {/* CORRECCIÓN CLAVE:
                1. Eliminado 'frameBorder' (obsoleto).
                2. Usamos style={{ border: 'none' }}.
            */}
            <iframe
              src={CHAT_URL}
              title="Ventana de chat del Asistente Virtual"
              width="100%"
              height="100%"
              style={{ border: "none", display: "block" }} 
              allow="clipboard-write" // Permite al bot copiar al portapapeles si es necesario
            />
            
            {/* Escudo invisible para cerrar menú al hacer clic en el área del chat */}
            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "transparent",
                }}
              />
            )}
          </div>
        </div>

        {/* 3. BOTÓN FLOTANTE (Trigger) */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Abrir asistente virtual"
            title="Abrir chat"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: THEME_COLOR,
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
              transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
            onMouseEnter={(e) => handleMouseEnter(e, 1.1, "0 8px 20px rgba(0, 0, 0, 0.4)")}
            onMouseLeave={(e) => handleMouseEnter(e, 1.0, "0 4px 15px rgba(0, 0, 0, 0.3)")}
          >
            <Bot size={32} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </>
  );
};

export default StackAIChatContainer;