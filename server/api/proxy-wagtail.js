// Proxy para la API de Wagtail que evita problemas de CORS
const runtimeConfig = useRuntimeConfig();
const DEFAULT_PAGE_URL = '/api/v2/pages/';

// Mostrar la API base configurada para diagnosticar problemas
console.log(`[proxy-wagtail] API Base configurada: ${runtimeConfig.public.apiBase}`);

export default defineEventHandler(async (event) => {
  try {
    // Obtener la URL de la consulta o usar la predeterminada
    const query = getQuery(event);
    let targetUrl;
    
    // Construir la URL completa según lo que se proporcione
    if (query.url) {
      // Si la URL comienza con una barra, prefijamos la URL base
      if (query.url.startsWith('/')) {
        targetUrl = `${runtimeConfig.public.apiBase}${query.url}`;
      } else {
        // Si ya es una URL completa, usarla directamente
        targetUrl = query.url.startsWith('http') ? query.url : `${runtimeConfig.public.apiBase}/${query.url}`;
      }
    } else {
      // URL por defecto si no se proporciona ninguna
      targetUrl = `${runtimeConfig.public.apiBase}${DEFAULT_PAGE_URL}`;
    }
    
    console.log(`[proxy-wagtail] Haciendo fetch a: ${targetUrl}`);
    
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
      console.error(`[proxy-wagtail] Error HTTP: ${response.status} ${response.statusText} para URL ${targetUrl}`);
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }
    
    // Convertir la respuesta a JSON
    const data = await response.json();
    console.log(`[proxy-wagtail] Respuesta recibida correctamente para ${targetUrl}`);
    
    // Imprimir una muestra estructurada de los datos (primeros niveles) para diagnosticar
    if (data) {
      // Crear una versión simplificada para el log (evitar impresiones masivas)
      const simplifiedData = {
        meta: data.meta || {},
        items_count: data.items ? data.items.length : 0,
        navbar_count: data.navbar ? data.navbar.length : 0,
        logo: data.logo || null,
        favicon: data.favicon || null
      };
      console.log(`[proxy-wagtail] Estructura de datos recibida:`, JSON.stringify(simplifiedData, null, 2));
    }
    
    // Devolver los datos - asegurarnos de que se devuelven como un objeto JSON plano (sin Proxy)
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    // Registrar el error para depuración
    console.error(`[proxy-wagtail] Error: ${error.message}`);
    
    // Devolver un error con formato JSON
    return {
      error: true,
      message: error.message || 'Error al obtener datos de la API de Wagtail'
    };
  }
});
