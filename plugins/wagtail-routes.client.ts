// plugins/wagtail-routes.client.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const { generateRoutes, fetchAllPages, getRouteMap, resetPages } = useWagtail()
  const router = useRouter()
  
  // Función para cargar y configurar las rutas dinámicas
  const loadDynamicRoutes = async (forceReload = false) => {
    try {
      console.log(`[${new Date().toISOString()}] Inicializando carga de rutas dinámicas...`)
      
      // Si es una recarga forzada, resetear las páginas
      if (forceReload) {
        console.log('Forzando recarga completa de páginas y rutas')
        resetPages()
      }
      
      // Cargar el sitemap primero para tener todas las páginas disponibles en mapas
      console.log('Cargando todas las páginas desde la API...')
      await fetchAllPages(forceReload)
      
      // Generar rutas dinámicamente
      console.log('Generando rutas dinámicas desde el mapa de páginas...')
      const dynamicRoutes = await generateRoutes()
      
      // Comprobar si hay rutas para añadir
      if (dynamicRoutes.length > 0) {
        console.log(`Añadiendo ${dynamicRoutes.length} rutas dinámicas al router`)
        
        // Eliminar TODAS las rutas dinámicas existentes para evitar duplicados
        const routeNames = router.getRoutes()
          .filter(r => r.name?.toString().startsWith('page-'))
          .map(r => r.name)
        
        routeNames.forEach(name => {
          if (name) {
            try {
              router.removeRoute(name)
              console.log(`Ruta eliminada: ${name}`)
            } catch (e) {
              // Ignorar errores al eliminar rutas
            }
          }
        })
        
        // Agregar nuevas rutas al router
        dynamicRoutes.forEach(route => {
          try {
            // Usar la ruta definida correctamente
            router.addRoute({
              ...route,
              // Usar una función para resolver el componente correctamente
              component: () => import('../pages/[...slug].vue')
            })
            console.log(`Ruta añadida: ${route.path} -> ${route.meta?.pageId}`)
          } catch (e) {
            console.warn(`No se pudo agregar la ruta ${route.path}: ${e}`)
          }
        })
        
        // Imprimir el mapa de rutas para depuración
        console.log('Mapa de rutas actualizado:', getRouteMap())
        console.log('Rutas dinámicas cargadas correctamente')
        return true
      } else {
        console.warn('No se encontraron rutas dinámicas para cargar')
        return false
      }
    } catch (error) {
      console.error('Error al cargar rutas dinámicas:', error)
      return false
    }
  }
  
  // Esperar a que el router esté listo
  await new Promise<void>((resolve) => {
    if (router.isReady()) {
      resolve()
    } else {
      router.isReady().then(() => resolve())
    }
  })
  
  // Cargar rutas iniciales
  await loadDynamicRoutes()
  
  // Escuchar evento de cambio de idioma para recargar rutas
  window.addEventListener('language-changed', async (event) => {
    // @ts-ignore
    const newLang = event?.detail?.language
    if (newLang) {
      console.log(`Evento de cambio de idioma detectado: ${newLang}. Recargando rutas...`)
      // Dar tiempo a que se actualice la URL
      setTimeout(() => loadDynamicRoutes(true), 200)
    }
  })
  
  // Exponer algunos métodos para depuración
  return {
    provide: {
      wagtailRoutes: {
          reload: async () => {
            const routes = await generateRoutes()
            console.log(`Recargadas ${routes.length} rutas dinámicas`)
            return routes
          },
          forceReload: async () => {
            return await loadDynamicRoutes(true)
          }
        }
      }
    }
  // El try/catch está dentro de loadDynamicRoutes
})
