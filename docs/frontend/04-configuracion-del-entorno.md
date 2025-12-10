# Levantar el entorno de desarrollo (Frontend)

## Ejecutar localmente

### Requisitos Previos

- **Node.js 18+**: Para ejecutar npm/yarn.
- **npm o yarn**: Gestor de paquetes.
- **Backend corriendo**: API en localhost:8080 (o configurado).

1. Clonar el proyecto

    ```bash
    git clone https://github.com/JaimeGLT/el-buen-corte.git
    ```

2. Ir al directorio del proyecto donde se clono el repositorio

    ```bash
    cd mi-proyecto
    ```

3. Instalar dependencias

    ```bash
    npm install
    ```

4. Iniciar el servidor

    ```bash
    npm run dev
    ```

5. ✅ Resultado esperado

    Cuando la ejecución sea exitosa, en la terminal aparecerá un mensaje similar a este:

    ![](.//npm-run-dev.png)

    **Nota:** El puerto puede variar dependiendo de la configuración de tu proyecto.
   

7. ✅ Inicio de sesion

   Una vez accedido al link proporcionado por la ejecucion, ingresar con las siguientes credenciales
   
   **Usuario/Correo**
   ```sh
    admin@gmail.com
   ```

   **Password**
   ```sh
    admin457
   ```









# Configuración del Entorno Frontend

## Requisitos Previos

- **Node.js 18+**: Para ejecutar npm/yarn.
- **npm o yarn**: Gestor de paquetes.
- **Backend corriendo**: API en localhost:8080 (o configurado).

## Instalación

1. Clonar repo y navegar: `cd el-buen-corte`
2. Instalar dependencias: `npm install`
3. Configurar backend URL en `src/utlis/axiosApi.ts` (por defecto localhost:8080)

## Ejecución en Desarrollo

1. `npm run dev`
2. Abrir `http://localhost:5173` (puerto Vite por defecto)

## Build para Producción

1. `npm run build` (genera dist/)
2. `npm run preview` para test local

## Variables de Entorno

- Crear `.env` para config (ej: VITE_API_URL=<http://localhost:8080/api/v1>)
- Usar en axiosApi.ts

## Linting

- `npm run lint` para verificar código

## Notas

- Asegurar CORS en backend.
- Puerto configurable en vite.config.ts

