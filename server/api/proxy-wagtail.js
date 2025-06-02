// Proxy para la API de Wagtail que evita problemas de CORS

// URL base de la API de Wagtail (definida directamente para evitar problemas de importación en Vercel)
const API_BASE_URL = 'https://e412-2806-103e-1d-3687-f08f-4014-a8d6-4606.ngrok-free.app';

// Página principal por defecto
const DEFAULT_PAGE_URL = `${API_BASE_URL}/api/v2/pages/3/`;

export default defineEventHandler(async (event) => {
  try {
    // Obtener la URL de la consulta o usar la predeterminada
    const query = getQuery(event);
    const apiUrl = query.url || DEFAULT_PAGE_URL;
    
    // Solicitud al API
    
    // Hacer la petición a la API de Wagtail desde el servidor con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout
    
    const response = await fetch(apiUrl, {
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
    
    // Respuesta exitosa
    
    // Devolver los datos
    return data;
  } catch (error) {
    // Manejar errores silenciosamente
    
    // Devolver un error con formato JSON
    return {
      error: true,
      message: error.message || 'Error al obtener datos de la API de Wagtail'
    };
  }
});
