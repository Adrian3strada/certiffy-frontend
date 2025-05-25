// Proxy para imágenes de Wagtail que evita problemas de CORS
import { API_BASE_URL } from '~/composables/useWagtailApi';

export default defineEventHandler(async (event) => {
  try {
    // Obtener la URL de la imagen del parámetro de consulta
    const query = getQuery(event);
    const imageUrl = query.url;
    
    if (!imageUrl) {
      return new Response('No se proporcionó URL de imagen', { status: 400 });
    }
    
    // Construir la URL completa
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`;
    
    // Acceder a la URL de la imagen
    
    // Hacer la petición a la URL de la imagen
    const response = await fetch(fullUrl, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      return new Response(`Error al obtener imagen: ${response.status}`, { status: response.status });
    }
    
    // Obtener el tipo de contenido de la imagen
    const contentType = response.headers.get('content-type');
    
    // Obtener los bytes de la imagen
    const imageData = await response.arrayBuffer();
    
    // Devolver la imagen con el tipo de contenido correcto
    return new Response(imageData, {
      headers: {
        'Content-Type': contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400' // Cachear por 24 horas
      }
    });
  } catch (error) {
    return new Response('Error al procesar la imagen', { status: 500 });
  }
});
