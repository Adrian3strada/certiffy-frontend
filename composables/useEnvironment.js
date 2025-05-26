// Composable para determinar el entorno y proporcionar funciones específicas
import { API_BASE_URL } from './useWagtailApi';
import { API_ROUTES } from '~/config/api';

export function useEnvironment() {
  // Detectar si estamos en producción (Vercel) o desarrollo local
  const isProduction = () => {
    if (typeof window !== 'undefined') {
      return window.location.hostname !== 'localhost' && 
             !window.location.hostname.includes('127.0.0.1');
    }
    return false;
  };

  // Función para obtener datos de la API usando el proxy para evitar problemas de CORS
  const fetchPageData = async (pageUrl) => {
    // Usamos el proxy tanto en producción como en desarrollo para evitar problemas de CORS
    console.log('Usando proxy para:', pageUrl);
    
    return await useFetch('/api/proxy-wagtail', {
      method: 'GET',
      query: { url: pageUrl },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  };

  // Función específica para obtener la página principal
  const fetchHomePage = () => {
    return fetchPageData(API_ROUTES.HOME_PAGE);
  };

  // Función específica para obtener las noticias
  const fetchNewsPage = () => {
    return fetchPageData(API_ROUTES.NEWS_PAGE);
  };

  return {
    isProduction,
    fetchPageData,
    fetchHomePage,
    fetchNewsPage
  };
}