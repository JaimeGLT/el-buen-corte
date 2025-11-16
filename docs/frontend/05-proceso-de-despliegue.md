# Proceso de Despliegue del Frontend

## Despliegue Local
1. Instalar dependencias: `npm install`
2. Build: `npm run build`
3. Servir con servidor estático (ej: `npx serve dist` o Apache/Nginx apuntando a dist/)

## Despliegue en Producción
- **Vercel/Netlify**: Subir dist/, configurar build command `npm run build`
- **AWS S3 + CloudFront**: Subir dist/ a S3, distribuir con CloudFront
- **Docker**: Dockerfile para Nginx servir dist/

## Configuración
- Variables de entorno para API URL.
- Asegurar HTTPS.
- Configurar base path si subdirectorio.

## Notas
- SPA: Configurar server para fallback a index.html.
- Optimizar build con Vite para producción.
