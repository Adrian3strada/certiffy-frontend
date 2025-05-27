<template>
  <q-layout view="hHh LpR fff">
    <!-- Navbar/Header (Único componente estático que mantenemos) -->
    <NavbarComponent 
      :logoUrl="navbarData.logoUrl" 
      :navItems="navbarData.navItems" 
    />

    <!-- Contenido principal dinámico -->
    <q-page-container>
      <slot />
    </q-page-container>

    <!-- El footer se ha movido a componentes dinámicos -->
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import NavbarComponent from '~/components/certiffy/NavbarComponent.vue';

// Datos para el navbar (único componente estático que mantenemos)
const navbarData = ref({
  logoUrl: '/images/logo-certiffy.png',
  navItems: [
    { label: 'Inicio', url: '/' },
    { label: 'Acerca de', url: '/acerca-de' },
    { label: 'Noticias', url: '/noticias' },
    { label: 'Pacto Verde', url: '/pacto-verde' },
    { label: 'Contacto', url: '/contacto' }
  ]
});
</script>

<style scoped>
/* Estructura básica para que el footer quede al final de la página */
.site-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Asegura que el contenedor ocupe toda la altura de la ventana */
}

.page-content {
  flex: 1; /* Hace que el contenido principal ocupe todo el espacio disponible */
}
</style>
