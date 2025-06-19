import { defineEventHandler, getQuery } from 'h3'
import { $fetch } from 'ofetch'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  try {
    // Obtiene la URL a la que hacer proxy desde los parámetros de consulta
    const query = getQuery(event)
    const targetUrl = query.url as string
    
    if (!targetUrl) {
      throw new Error('URL parameter is required')
    }

    const config = useRuntimeConfig()
    const baseApiUrl = config.public.apiBase || ''
    
    // Construye la URL completa usando la base API
    let fullUrl = targetUrl.startsWith('http') 
      ? targetUrl 
      : `${baseApiUrl}${targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`}`
      
    // Añadir parámetro de locale si aún no está incluido
    if (!fullUrl.includes('locale=')) {
      fullUrl += fullUrl.includes('?') ? '&locale=es' : '?locale=es';
    }
    
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
    // console.error('Error en proxy API:', error)
    return {
      error: error.message || 'Error en la solicitud al API',
      status: error.status || 500
    }
  }
})
