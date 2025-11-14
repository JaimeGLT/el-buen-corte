# Arquitectura del Frontend

## Patrón Arquitectónico
- **SPA (Single Page Application)**: Toda la app en una página, navegación con React Router.
- **Component-Based**: Componentes reutilizables, organizados por páginas y features.
- **Hooks y Context**: Estado local con hooks, global con Context API.

## Estructura de Componentes
- **Páginas (pages/)**: Una por módulo (Login, AppointmentPage, etc.), contienen lógica y layout.
- **Componentes (components/)**: Reutilizables (Button, Modal, Sidebar, etc.).
- **Context (context/)**: AuthContext para estado de usuario.
- **Hooks (hooks/)**: getHook para fetches.
- **Utils (utlis/)**: Axios config, auth helpers.
- **Types (types/)**: Interfaces TypeScript para datos.

## Navegación y Rutas
- **React Router**: Rutas definidas en App.tsx.
- **ProtectedRoute**: Componente para rutas autenticadas.
- **Sidebar**: Navegación lateral.

## Gestión de Estado
- **Local**: useState en componentes.
- **Global**: AuthContext para token y user.
- **Forms**: React Hook Form con Zod para validación.

## Comunicación con Backend
- **Axios**: Instancia configurada en axiosApi.ts, interceptores para JWT.
- **API Calls**: En hooks o directamente en componentes.

## Estilos
- **Tailwind CSS**: Clases utilitarias para responsive design.
- **Componentes Estilizados**: Botones, inputs con Tailwind.

## Seguridad
- **JWT**: Almacenado en localStorage, enviado en headers.
- **Rutas Protegidas**: Redirect a login si no autenticado.

## Rendimiento
- **Lazy Loading**: Import dinámico si necesario.
- **Memoización**: React.memo para componentes pesados.

Esta arquitectura es modular, escalable y sigue mejores prácticas de React moderno.
