// Endpoint para probar la conexión directa con la API de Wagtail y depurar problemas
import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  
  console.log(`[test-connection] Probando conexión a la API de Wagtail: ${apiBase}`)
  
  try {
    // 1. Probar la conexión directamente con fetch para verificar la respuesta básica
    const response = await fetch(`${apiBase}/api/v2/pages/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      // Agregamos un timeout de 10 segundos
      signal: AbortSignal.timeout(10000)
    })
    
    console.log(`[test-connection] Respuesta recibida con status: ${response.status}`)
    
    if (!response.ok) {
      return {
        success: false,
        message: `Error de conexión: ${response.status} ${response.statusText}`,
        apiBase: apiBase
      }
    }
    
    // 2. Intentar obtener el JSON para verificar la estructura de datos
    const data = await response.json()
    
    // 3. Devolver un resumen de la respuesta para diagnóstico
    return {
      success: true,
      apiBase: apiBase,
      status: response.status,
      contentType: response.headers.get('content-type'),
      dataStructure: {
        hasItems: !!data.items,
        itemsCount: data.items ? data.items.length : 0,
        hasNavbar: !!data.navbar,
        navbarCount: data.navbar ? data.navbar.length : 0,
        hasLogo: !!data.logo,
        hasMeta: !!data.meta
      },
      sampleItems: data.items ? data.items.slice(0, 2).map(item => ({
        id: item.id,
        title: item.title,
        type: item.meta?.type,
        slug: item.meta?.slug,
        url: item.meta?.html_url
      })) : []
    }
  } catch (error) {
    console.error(`[test-connection] Error al conectar con la API: ${error.message}`)
    
    return {
      success: false,
      message: `Error al conectar con la API: ${error.message}`,
      apiBase: apiBase,
      error: error.stack
    }
  }
})
