/**
 * Ejemplo de configuración de variables de entorno para desarrollo local
 * Para usar estas variables:
 * 1. Crea un archivo .env.local en la raíz del proyecto
 * 2. Copia y pega estas variables con tus propios valores
 */

export default {
  // URL base de la API de Wagtail (requerida)
  NUXT_PUBLIC_API_BASE: 'http://localhost:8000',
  
  // URL del frontend (opcional, para enlaces absolutos)
  NUXT_PUBLIC_FRONTEND_URL: 'http://localhost:3000',
  
  // Imágenes y recursos por defecto (opcionales)
  NUXT_PUBLIC_DEFAULT_PLACEHOLDER_IMAGE: '/img/placeholder-default.jpg',
}
