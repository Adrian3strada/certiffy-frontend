// Proxy para la API de Wagtail que evita problemas de CORS
import { defineEventHandler, getQuery } from 'h3';
import { useRuntimeConfig } from '#imports';

const DEFAULT_PAGE_URL = '/api/v2/pages/?locale=es';

export default defineEventHandler(async (event) => {
  try {
    // Obtener la URL de la consulta o usar la predeterminada
    const query = getQuery(event);
    let targetUrl: string;
    const runtimeConfig = useRuntimeConfig();
    
    // Construir la URL completa según lo que se proporcione
    if (query.url) {
      const pathUrl = query.url as string;
      
      // Si la URL comienza con una barra, prefijamos la URL base
      if (pathUrl.startsWith('/')) {
        targetUrl = `${runtimeConfig.public.apiBase}${pathUrl}`;
      } else {
        // Si ya es una URL completa, usarla directamente
        targetUrl = pathUrl.startsWith('http') ? 
          pathUrl : 
          `${runtimeConfig.public.apiBase}/${pathUrl}`;
      }
      
      // Añadir parámetro de locale si aún no está incluido
      if (!targetUrl.includes('locale=')) {
        // Usar 'es' como valor por defecto siempre para garantizar compatibilidad
        // La API de Wagtail espera este formato exactamente
        targetUrl += targetUrl.includes('?') ? '&locale=es' : '?locale=es';
      }
    } else {
      // URL por defecto si no se proporciona ninguna - ya incluye el prefijo /es/
      targetUrl = `${runtimeConfig.public.apiBase}${DEFAULT_PAGE_URL}`;
    }
    
    // Hacer la petición a la API de Wagtail desde el servidor con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout
    
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    
    // Convertir la respuesta a JSON
    const data = await response.json();
    
    // Devolver los datos - asegurarnos de que se devuelven como un objeto JSON plano (sin Proxy)
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    // Devolver un error con formato JSON
    return {
      error: true,
      message: (error as Error).message || 'Error al obtener datos de la API de Wagtail'
    };
  }
});
