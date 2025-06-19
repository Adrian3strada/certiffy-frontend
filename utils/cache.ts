/**
 * Añade parámetros anti-caché a una URL
 * @param url URL a la que añadir parámetros anti-caché
 * @returns URL con parámetros anti-caché
 */
export function addNoCacheParams(url: string): string {
  // Añadir timestamp para evitar caché
  const timestamp = new Date().getTime();
  const separator = url.includes('?') ? '&' : '?';
  
  return `${url}${separator}_nocache=${timestamp}`;
}

/**
 * Genera opciones para evitar caché en peticiones fetch
 * @returns Objeto con cabeceras anti-caché
 */
export function getNoCacheHeaders(): Record<string, string> {
  return {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };
}
