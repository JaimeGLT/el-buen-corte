import React from 'react';

interface ScissorsLoaderProps {
  /** * Clases para controlar tamaño y color. 
   * Por defecto: 'w-12 h-12 text-blue-600'
   */
  className?: string;
}

export const ScissorsLoader: React.FC<ScissorsLoaderProps> = ({ 
  className = "w-12 h-12 text-primary-bg" 
}) => {
  return (
    // Contenedor relativo. Usa 'className' para tamaño y color.
    <div className={`relative flex items-center justify-center ${className}`} role="status">
      
      {/* 1. El anillo de fondo (opacidad baja para dar contexto) */}
      <div className="absolute inset-0 border-4 border-current opacity-20 rounded-full"></div>

      {/* 2. El anillo que gira (animate-spin) */}
      {/* border-t-transparent crea el efecto de "cargando" */}
      <div className="absolute inset-0 border-4 border-current border-t-transparent rounded-full animate-spin"></div>

      {/* 3. El icono de las tijeras (Estático en el centro) */}
      {/* fill-current hereda el color del texto del padre */}
      <svg 
        className="w-1/2 h-1/2 fill-current" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.57 2.43a1 1 0 0 1 1.41 1.41L14.83 8l4.15 4.15a1 1 0 0 1 0 1.41 1 1 0 0 1-1.41 0L13.41 9.41 10.5 12.32a5.47 5.47 0 0 1 1.17 3.36 5.5 5.5 0 1 1-5.5-5.5 5.47 5.47 0 0 1 3.36 1.17l2.91-2.91L8.25 4.25a1 1 0 0 1 0-1.41 1 1 0 0 1 1.41 0L13.83 7l4.15-4.15 1.41-1.42zM6.5 12a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm9.68 0a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" fillRule="evenodd"/>
      </svg>
      
      <span className="sr-only">Cargando...</span>
    </div>
  );
};