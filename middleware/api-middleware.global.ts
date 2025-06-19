// Middleware global para manejar las peticiones a la API
import { defineNuxtRouteMiddleware } from '#app';
import type { RouteLocationNormalized } from 'vue-router';

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  // Por ahora solo registramos la ruta y eliminamos los logs de depuración
  if (process.client) {
    // No hacemos nada para evitar logs innecesarios
  }
  
  // Middleware simple, no modifica las rutas
  return;
});
