// Middleware global para resolver páginas y rutas dinámicas
export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('Middleware page-resolver ejecutándose para ruta:', to.path);
  
  // Usar los composables necesarios
  const { knownRoutes, findPageIdForRoute } = useWagtail();
  const { normalizeUrl } = useWagtailApi();

  try {
    // Si la ruta contiene '/dynamic/', redirigir a la versión limpia silenciosamente
    if (to.path.includes('/dynamic/')) {
      const cleanPath = to.path.replace('/dynamic/', '/');
      console.log(`Redireccionando de ${to.path} a ${cleanPath}`);
      return navigateTo(cleanPath, { replace: true });
    }
    
    // Normalizar la ruta actual para comparaciones consistentes
    const normalizedPath = normalizeUrl(to.path);
    
    console.log(`Ruta normalizada: ${normalizedPath}`);
    console.log('Rutas conocidas disponibles:', Object.keys(knownRoutes).length);
    
    // Si los mapas aún no están listos, dejar pasar la navegación
    if (Object.keys(knownRoutes).length === 0) {
      console.warn('El mapa de rutas aún no está listo, dejando pasar la navegación para que el componente maneje el fallback.');
      return;
    }
    
    // Verificar si estamos en la ruta /es (o /en, etc.) y necesitamos cargar la página raíz
    if (normalizedPath.match(/^\/[a-z]{2}\/?$/)) {
      console.log(`Interceptando ruta de idioma principal: ${normalizedPath}`);
      
      // Buscar el ID de página para esta ruta
      const pageId = findPageIdForRoute(normalizedPath);
      
      if (pageId) {
        console.log(`✅ Encontrado ID ${pageId} para ruta ${normalizedPath}`);
        to.meta.pageId = pageId;
        to.meta.layout = 'dynamic'; // Usar layout dinámico
        return; // Continuar navegación
      } else {
        console.warn(`⚠️ No se encontró ID para la ruta ${normalizedPath}, intentando buscar la homepage`);
        // Intentar encontrar la página de inicio (homepage)
        to.meta.pageId = 3; // ID típico de la homepage
        to.meta.layout = 'dynamic';
        return; // Continuar navegación
      }
    }
    
    // Procesamiento de rutas dinámicas (páginas de contenido)
    const pageId = findPageIdForRoute(normalizedPath);
    
    if (pageId) {
      console.log(`✅ Ruta ${normalizedPath} corresponde a página con ID: ${pageId}`);
      
      // Establecer el ID de página y permitir que el componente lo cargue
      to.meta.pageId = pageId;
      to.meta.layout = 'dynamic';
      return;
    } else {
      // Si no encontramos una coincidencia pero la ruta no está registrada en Nuxt
      if (!to.matched || to.matched.length === 0) {
        console.warn(`⚠️ Ruta no encontrada: ${normalizedPath}, verificando posibles páginas dinámicas...`);
        
        // Si no tenemos rutas cargadas todavía, podríamos forzar una carga
        if (Object.keys(knownRoutes).length === 0) {
          console.log('No hay rutas cargadas, se intentarán cargar en el componente');
        }
      }
    }
    
    console.log('Continuando navegación normal para:', normalizedPath);
  } catch (error) {
    console.error('Error en middleware page-resolver:', error);
  }
});
