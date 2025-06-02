<template>
  <!-- Usar el DynamicPageWrapper para manejar toda la lógica de carga y renderizado de páginas -->
  <DynamicPageWrapper />
</template>

<script setup>
import DynamicPageWrapper from '~/components/api/core/DynamicPageWrapper.vue';

// Utilizar DynamicPageWrapper que maneja toda la lógica de carga de páginas
// dinámicamente desde la API de Wagtail
</script>

<style scoped>
.dynamic-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
