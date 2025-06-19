// Composable para determinar el entorno y proporcionar funciones específicas
import { API_ROUTES } from '~/config/api';
import type { UseFetchReturn, UseFetchOptions } from '#app';

// Interfaces para TypeScript
interface ApiResponse {
  data: any;
  error: Error | null;
}

export function useEnvironment() {
  // Detectar si estamos en producción (Vercel) o desarrollo local
  const isProduction = (): boolean => {
    if (typeof window !== 'undefined') {
      return window.location.hostname !== 'localhost' && 
             !window.location.hostname.includes('127.0.0.1');
    }
    return false;
  };

  // Función para obtener datos de la API usando el proxy para evitar problemas de CORS
  const fetchPageData = async (pageUrl: string): Promise<UseFetchReturn<any>> => {
    return await useFetch('/api/proxy-wagtail', {
      method: 'GET',
      query: { url: pageUrl },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  };

  // Función para obtener una página por ID
  const fetchPageById = (id: number): Promise<UseFetchReturn<any>> => {
    return fetchPageData(API_ROUTES.getPageById(id));
  };

  // Función para obtener una página por slug
  const fetchPageBySlug = (slug: string): Promise<UseFetchReturn<any>> => {
    return fetchPageData(API_ROUTES.getPageBySlug(slug));
  };

  // Función para buscar páginas
  const searchPages = (query: string): Promise<UseFetchReturn<any>> => {
    return fetchPageData(API_ROUTES.searchPages(query));
  };

  // Función genérica para obtener páginas con parámetros personalizados
  const fetchPages = (params?: Record<string, string>): Promise<UseFetchReturn<any>> => {
    let url = API_ROUTES.PAGES_BASE;
    if (params) {
      const urlObj = new URL(url);
      Object.entries(params).forEach(([key, value]) => {
        urlObj.searchParams.append(key, value);
      });
      url = urlObj.toString();
    }
    return fetchPageData(url);
  };

  return {
    isProduction,
    fetchPageData,
    fetchPageById,
    fetchPageBySlug,
    searchPages,
    fetchPages
  };
}
