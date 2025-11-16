# Frontend: el-buen-corte

## Introducción
El frontend del proyecto "proyecto_erp_el_buen_corte" es una Single Page Application (SPA) desarrollada con React y TypeScript, diseñada para proporcionar una interfaz de usuario intuitiva para gestionar las operaciones de la peluquería "El Buen Corte". Consume la API REST del backend para funcionalidades como autenticación, gestión de clientes, citas, inventario y reportes. Está optimizado para una experiencia de usuario fluida con navegación basada en rutas.

## Arquitectura
- **Tipo**: Single Page Application (SPA) con enrutamiento del lado cliente.
- **Patrón**: Basado en componentes reutilizables, con separación de responsabilidades (páginas, componentes UI, hooks, utilidades).
- **Estado Global**: Usa React Context (AuthContext) para autenticación y localStorage para persistencia de tokens JWT. No utiliza bibliotecas de estado global complejas como Redux, manteniendo simplicidad.
- **Navegación**: React Router DOM para rutas protegidas (ProtectedRoute) basadas en autenticación.
- **Integración con Backend**: Llamadas HTTP via Axios, con manejo de JWT para autenticación.
- **Componentes**: Incluye modales para CRUD, gráficos para reportes y un sidebar de navegación.

## Tecnologías Utilizadas
- **Lenguaje**: TypeScript (para tipado fuerte y reducción de errores).
- **Framework**: React 19 (con hooks y componentes funcionales).
- **Build Tool**: Vite (para desarrollo rápido, hot reload y bundling optimizado).
- **Estilos**: Tailwind CSS (framework CSS utility-first para diseño responsivo y rápido).
- **Enrutamiento**: React Router DOM versión 7.9.4.
- **Formularios y Validación**: React Hook Form con Zod (esquemas de validación declarativos).
- **Gráficos**: Chart.js (para visualización de datos en reportes, e.g., ingresos, citas).
- **HTTP Client**: Axios versión 1.12.2 (para llamadas a la API backend).
- **Autenticación**: JWT Decode (para decodificar y validar tokens).
- **UI/UX**:
  - Lucide React: Iconos vectoriales.
  - React Hot Toast: Notificaciones emergentes.
  - React To Print: Impresión de documentos (e.g., recibos de pago).
- **Herramientas de Desarrollo**:
  - ESLint: Linting para código limpio.
  - TypeScript ESLint: Reglas específicas para TypeScript.
  - Vite Plugin React: Integración con React.

## Estructura del Proyecto
- **Raíz**: `el-buen-corte/` (proyecto Vite).
- **Código Fuente** (`src/`):
  - `components/`: Componentes reutilizables (e.g., Sidebar, Modal, Button, gráficos como BarChart, PieChart).
  - `pages/`: Páginas principales en subcarpetas (e.g., Client/, Appointment/, Inventory/, Payment/, Report/, Personal/, Service/).
  - `context/`: AuthContext para gestión de estado de autenticación.
  - `hooks/`: getHook (para fetching de datos y manejo de estado en componentes).
  - `types/`: Definiciones TypeScript (e.g., Client.ts, Service.ts, tipos para citas, pagos).
  - `utlis/`: Utilidades como auth.ts (manejo de tokens JWT), axiosApi.ts (configuración de Axios con interceptores), getState.ts, parseDuration.ts.
- **Configuración**:
  - `vite.config.ts`: Configuración de Vite con plugins para React y Tailwind.
  - `package.json`: Dependencias, scripts (e.g., "dev", "build", "lint") y configuración de TypeScript.
- **Público**: `public/` con assets estáticos (e.g., vite.svg).
- **Otros**: `tsconfig.json`, `eslint.config.js` para configuración de TypeScript y linting.

## Configuración del Entorno
- **Requisitos**: Node.js, npm o yarn.
- **Instalación**: `npm install` (instala dependencias desde package.json).
- **Ejecución**: `npm run dev` (inicia servidor de desarrollo en localhost:5173 por defecto).
- **Build**: `npm run build` (genera build optimizado en dist/).
- **Preview**: `npm run preview` (sirve el build localmente).
- **Linting**: `npm run lint` (verifica código con ESLint).

## Proceso de Despliegue
- **Desarrollo**: Usa Vite para hot reload y desarrollo rápido.
- **Producción**: Build estático con `npm run build`, compatible con hosting como Vercel, Netlify o servidores web tradicionales.
- **Configuración**: No requiere backend en el mismo host; se conecta via HTTP a la API (configurada en axiosApi.ts).

## Guía de Estilos y Componentes
- **Estilos**: Tailwind CSS para clases utility (e.g., flex, bg-blue-500). Diseño responsivo y moderno.
- **Componentes Principales**:
  - `Sidebar`: Navegación lateral con enlaces a páginas.
  - `Modal`: Para formularios de creación/edición (e.g., CreateClientModal).
  - `Button`, `Input`, `Select`, `TextArea`: Componentes UI básicos.
  - Gráficos: BarChart, PieChart, LineChart para dashboards.
  - `ProtectedRoute`: Envuelve rutas para requerir autenticación.
- **Páginas**: Cada módulo tiene su página (e.g., ClientPage con lista y modales CRUD).
- **Validación**: Usa Zod para esquemas (e.g., ClientSchema.ts) integrados con React Hook Form.

## Mejores Prácticas
- **Tipado**: TypeScript en todos los archivos para seguridad de tipos.
- **Separación de Concerns**: Componentes UI separados de lógica (hooks, utils).
- **Reutilización**: Componentes modulares y hooks personalizados.
- **Accesibilidad**: Uso de etiquetas semánticas y Tailwind para responsividad.
- **Performance**: Vite optimiza builds; Axios maneja caching básico.
- **Mejoras Sugeridas**: Agregar tests (e.g., Jest, React Testing Library), internacionalización y manejo de errores global.

## Notas de Versión
- Versión actual: 0.0.0.
- Dependencias principales: React 19, Vite 7, Tailwind 4.
- Cambios recientes: Integración de gráficos, formularios con validación y navegación protegida.
