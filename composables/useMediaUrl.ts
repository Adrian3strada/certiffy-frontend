import { API_ROUTES } from '~/config/api'

/**
 * Composable para manejar URLs de medios desde la API
 * Convierte rutas relativas de medios en URLs absolutas
 */
export function useMediaUrl() {
  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBase || '';
  
  /**
   * Convierte una ruta relativa de medio en una URL absoluta
   * @param path Ruta relativa del medio (ej: /media/images/logo.png)
   * @returns URL absoluta del medio
   */
  const getAbsoluteMediaUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    
    try {
      // Si ya es una URL absoluta, devolverla tal cual
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
      }
      
      // Asegurarse que path comience con /
      const formattedPath = path.startsWith('/') ? path : `/${path}`;
      
      // Construir la URL absoluta usando la config de runtime
      return `${apiBaseUrl}${formattedPath}`;
    } catch (e) {
      // console.error('Error al construir URL absoluta:', e);
      return '';
    }
  };

  /**
   * Prepara una URL para usar con el proxy de imágenes
   * @param path Ruta relativa o absoluta del medio
   * @returns URL para el proxy de imágenes
   */
  const getProxiedMediaUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    
    try {
      // Obtener la URL absoluta primero
      const absoluteUrl = getAbsoluteMediaUrl(path);
      
      // Devolver la URL para el proxy
      return `/api/proxy-image?url=${encodeURIComponent(absoluteUrl)}`;
    } catch (e) {
      // console.error('Error al crear URL proxy para imagen:', e);
      return '';
    }
  };

  return {
    getAbsoluteMediaUrl,
    getProxiedMediaUrl
  };
}
