// plugins/wagtail-routes.client.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const { generateRoutes, fetchAllPages, resetPages } = useWagtail()
  const router = useRouter()

  // Función para cargar y configurar las rutas dinámicas
  const loadDynamicRoutes = async (forceReload = false) => {
    try {
      // console.log(`[${new Date().toISOString()}] Inicializando carga de rutas dinámicas...`)

      // Si es una recarga forzada, resetear las páginas
      if (forceReload) {
        // console.log('Forzando recarga completa de páginas y rutas')
        resetPages()
      }

      // Cargar el sitemap primero para tener todas las páginas disponibles en mapas
      // console.log('Cargando todas las páginas desde la API...')
      await fetchAllPages('es') // Pasar string en lugar de boolean

      // Generar rutas dinámicamente
      // console.log('Generando rutas dinámicas desde el mapa de páginas...')
      const dynamicRoutesData = await generateRoutes()

      // Comprobar si hay rutas para añadir - ahora es un objeto, no un array
      if (dynamicRoutesData.routes && Object.keys(dynamicRoutesData.routes).length > 0) {
        // console.log(`Añadiendo ${Object.keys(dynamicRoutesData.routes).length} rutas dinámicas al router`)

        // Eliminar TODAS las rutas dinámicas existentes para evitar duplicados
        const routeNames = router.getRoutes()
          .filter(r => r.name?.toString().startsWith('page-'))
          .map(r => r.name)

        routeNames.forEach(name => {
          if (name) {
            try {
              router.removeRoute(name)
              // console.log(`Ruta eliminada: ${name}`)
            } catch (e) {
              // Ignorar errores al eliminar rutas
            }
          }
        })

        // Agregar nuevas rutas al router
        Object.values(dynamicRoutesData.routes).forEach((route: any) => {
          try {
            // Usar la ruta definida correctamente
            router.addRoute({
              ...route,
              // Usar una función para resolver el componente correctamente
              component: () => import('~/pages/[...slug].vue')
            })
            // console.log(`Ruta añadida: ${route.path} -> ${route.meta?.pageId}`)
          } catch (e) {
            // console.warn(`No se pudo agregar la ruta ${route.path}: ${e}`)
          }
        })

        // console.log('Rutas dinámicas cargadas correctamente')
        return true
      } else {
        // console.warn('No se encontraron rutas dinámicas para cargar')
        return false
      }
    } catch (error) {
      // console.error('Error al cargar rutas dinámicas:', error)
      return false
    }
  }

  // Esperar a que el router esté listo
  try {
    await router.isReady()
  } catch (e) {
    // Si hay error, continuar
  }

  // Cargar rutas iniciales
  await loadDynamicRoutes()

  // Escuchar evento de cambio de idioma para recargar rutas
  window.addEventListener('language-changed', async (event) => {
    // @ts-ignore
    const newLang = event?.detail?.language
    if (newLang) {
      console.log(`Evento de cambio de idioma detectado: ${newLang}. Recargando rutas...`)
      // Dar tiempo a que se actualice la URL y limpiar las rutas existentes
      setTimeout(async () => {
        try {
          // Limpiar rutas existentes primero
          const routeNames = router.getRoutes()
            .filter(r => r.name?.toString().startsWith('page-'))
            .map(r => r.name)

          routeNames.forEach(name => {
            if (name) {
              try {
                router.removeRoute(name)
                console.log(`Ruta eliminada durante cambio de idioma: ${name}`)
              } catch (e) {
                // Ignorar errores al eliminar rutas
              }
            }
          })

          // Recargar rutas con el nuevo idioma
          await loadDynamicRoutes(true)
          console.log(`Rutas recargadas para idioma: ${newLang}`)
        } catch (error) {
          console.error('Error al recargar rutas durante cambio de idioma:', error)
        }
      }, 300) // Aumentar el delay para asegurar que la URL se actualice
    }
  })

  // Exponer algunos métodos para depuración
  return {
    provide: {
      wagtailRoutes: {
        reload: async () => {
          const routes = await generateRoutes()
          // console.log(`Recargadas ${routes.length} rutas dinámicas`)
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
