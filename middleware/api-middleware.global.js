// Middleware global para manejar las peticiones a la API
// Este middleware intercepta las peticiones y aplica configuraciones específicas

export default defineNuxtRouteMiddleware((to, from) => {
  // Aquí podemos interceptar y modificar las rutas según necesitemos
  // Por ahora solo registramos información para debug
  if (process.client) {
    console.log('Middleware API - Ruta:', to.path);
  }
});
