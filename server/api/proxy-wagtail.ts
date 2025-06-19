// Proxy para la API de Wagtail que evita problemas de CORS
import { defineEventHandler, getQuery } from 'h3';
import { useRuntimeConfig } from '#imports';

const DEFAULT_PAGE_URL = '/api/v2/pages/';

export default defineEventHandler(async (event) => {
  try {
    // Obtener la URL de la consulta o usar la predeterminada
    const query = getQuery(event);
    let targetUrl: string;
    const runtimeConfig = useRuntimeConfig();
    
    // Construir la URL completa según lo que se proporcione
    if (query.url) {
      // Si la URL comienza con una barra, prefijamos la URL base
      if ((query.url as string).startsWith('/')) {
        targetUrl = `${runtimeConfig.public.apiBase}${query.url}`;
      } else {
        // Si ya es una URL completa, usarla directamente
        targetUrl = (query.url as string).startsWith('http') ? 
          query.url as string : 
          `${runtimeConfig.public.apiBase}/${query.url}`;
      }
    } else {
      // URL por defecto si no se proporciona ninguna
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
