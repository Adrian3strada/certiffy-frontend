<template>
  <q-layout view="hHh LpR fff">
    <!-- Navbar/Header completamente dinámico basado en la API -->
    <ApiNavbarComponent />

    <!-- Contenido principal dinámico sin padding para permitir componentes a todo el ancho -->
    <q-page-container class="full-width-container">
      <slot />
    </q-page-container>

    <!-- Footer dinámico que consume datos de la API de Wagtail -->
    <ApiFooterComponent />
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import ApiNavbarComponent from '~/components/api/layout/ApiNavbarComponent.vue';
import ApiFooterComponent from '~/components/api/layout/ApiFooterComponent.vue';
import { API_BASE_URL } from '~/composables/useWagtailApi';

</script>

<style>
/* Estructura básica para que el footer quede al final de la página */
.site-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Asegura que el contenedor ocupe toda la altura de la ventana */
}

.page-content {
  flex: 1; /* Hace que el contenido principal ocupe todo el espacio disponible */
}

/* Estilos para permitir componentes a todo el ancho */
.full-width-container {
  padding: 0 !important;
  max-width: 100vw !important;
  width: 100vw !important;
  overflow-x: hidden !important;
}

/* Quitar padding de las páginas para componentes a ancho completo */
.q-page {
  padding: 0 !important;
}

.no-padding {
  padding: 0 !important;
}
</style>
