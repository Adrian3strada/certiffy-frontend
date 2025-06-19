import { defineEventHandler, getQuery } from 'h3'
import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  try {
    // Obtiene la URL a la que hacer proxy desde los parámetros de consulta
    const query = getQuery(event)
    const targetUrl = query.url as string
    
    if (!targetUrl) {
      throw new Error('URL parameter is required')
    }

    const config = useRuntimeConfig()
    const baseApiUrl = config.public.apiBase || 'http://localhost:8000'
    
    // Construye la URL completa usando la base API
    const fullUrl = targetUrl.startsWith('http') 
      ? targetUrl 
      : `${baseApiUrl}${targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`}`
    
    // Realiza la solicitud al endpoint real y devuelve la respuesta
    const response = await $fetch(fullUrl, {
      headers: {
        // Puedes enviar encabezados personalizados según sea necesario
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    
    return response
  } catch (error: any) {
    console.error('Error en proxy API:', error)
    return {
      error: error.message || 'Error en la solicitud al API',
      status: error.status || 500
    }
  }
})
