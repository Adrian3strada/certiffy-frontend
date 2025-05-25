// Proxy para la API de Wagtail que evita problemas de CORS
import { API_BASE_URL } from '~/composables/useWagtailApi';

export default defineEventHandler(async (event) => {
  try {
    // Obtener la URL de la consulta o usar la predeterminada
    const query = getQuery(event);
    const apiUrl = query.url || `${API_BASE_URL}/api/v2/pages/3/`;
    
    // Hacer la petición a la API de Wagtail desde el servidor
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    });
    
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    
    // Convertir la respuesta a JSON
    const data = await response.json();
    
    // Devolver los datos
    return data;
  } catch (error) {
    // Manejar errores
    console.error('Error en el proxy de Wagtail:', error);
    
    // Devolver un error con formato JSON
    return {
      error: true,
      message: error.message || 'Error al obtener datos de la API de Wagtail'
    };
  }
});
