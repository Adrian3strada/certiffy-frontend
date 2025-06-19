// server/api/proxy-image.ts - Versión original que funcionaba
export default defineEventHandler(async (event) => {
  // Obtener URL de la imagen desde la query
  const query = getQuery(event);
  let imageUrl = query.url as string;

  // Validar que hay URL
  if (!imageUrl) {
    throw createError({ statusCode: 400, statusMessage: 'URL requerida' });
  }

  // Eliminar comillas si las tiene
  if (imageUrl.startsWith('"') && imageUrl.endsWith('"')) {
    imageUrl = imageUrl.slice(1, -1);
  }
  
  // Construir URL completa si es relativa
  const config = useRuntimeConfig();
  if (!imageUrl.startsWith('http')) {
    const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    imageUrl = `${config.public.apiBase}${path}`;
  }
  
  try {
    // Headers necesarios para ngrok
    const headers = {
      'ngrok-skip-browser-warning': 'true',
      'bypass-tunnel-reminder': 'true'
    };
    
    // Obtener la imagen
    const response = await fetch(imageUrl, { headers });
    
    if (!response.ok) {
      throw createError({ 
        statusCode: response.status, 
        statusMessage: response.statusText 
      });
    }
    
    // Procesar respuesta
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const data = await response.arrayBuffer();
    
    // Configurar headers de respuesta
    setHeaders(event, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400'
    });
    
    // Devolver imagen
    return Buffer.from(data);
    
  } catch (error) {
    console.error('Error en proxy de imagen:', error);
    throw createError({ statusCode: 500 });
  }
});