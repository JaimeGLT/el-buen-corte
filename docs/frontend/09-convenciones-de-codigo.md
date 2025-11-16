# Convenciones de Código y Sintaxis en el Frontend

## Nomenclatura
- **Componentes**: PascalCase (ej: `App.tsx`, `Button.tsx`).
- **Archivos**: PascalCase para componentes, camelCase para utils (ej: `axiosApi.ts`).
- **Variables/Funciones**: camelCase (ej: `userData`, `handleSubmit`).
- **Constantes**: UPPER_CASE (ej: `API_URL`).
- **Interfaces/Tipos**: PascalCase (ej: `ClientType`, `AuthContextType`).
- **Hooks**: camelCase con 'use' (ej: `useState`, `useEffect`).
- **Carpetas**: lowercase (ej: `components/`, `pages/`).

## Estructura de Archivos y Carpetas
- **src/**: Código fuente.
- **components/**: Componentes reutilizables.
- **pages/**: Páginas por módulo (subcarpetas para modales/tipos).
- **hooks/**: Hooks personalizados.
- **types/**: Definiciones TypeScript.
- **utlis/**: Utilidades (nota: 'utlis' es typo, debería ser 'utils').
- **assets/**: Imágenes/iconos.

## Sintaxis Común
- **Imports**: Agrupados por externos, luego internos.
  ```tsx
  import React from 'react';
  import { Button } from '../components/Button';
  ```
- **Componentes**: Funcionales con hooks.
  ```tsx
  const MyComponent = () => {
    const [state, setState] = useState(initial);
    return <div>...</div>;
  };
  ```
- **Props**: Tipadas con interfaces.
  ```tsx
  interface Props {
    title: string;
  }
  const Component: React.FC<Props> = ({ title }) => ...
  ```
- **Estilos**: Tailwind classes inline.
  ```tsx
  <div className="flex justify-center p-4">
  ```
- **Forms**: React Hook Form con Zod.
  ```tsx
  const schema = z.object({ name: z.string() });
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
  ```
- **API Calls**: Axios en hooks o componentes.
  ```tsx
  const response = await axios.get('/api/clients');
  ```

## Buenas Prácticas
- Usar TypeScript estrictamente.
- Componentes pequeños y reutilizables.
- ESLint para consistencia.
- Comentarios en lógica compleja.
- Responsive con Tailwind breakpoints (sm:, md:).

Esta convención mantiene el código limpio y escalable en React/TypeScript.
