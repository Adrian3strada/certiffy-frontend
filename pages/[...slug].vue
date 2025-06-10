<template>
  <div>
    <q-spinner-dots color="primary" size="3em" v-if="pending" />
    <div v-else>
      <!-- Esta página es un redirector al componente dynamic/[...slug].vue -->
      <p>Redirigiendo...</p>
    </div>
  </div>
</template>

<script setup>
// Este componente simplemente redirecciona a la versión dinámica
// Esto mantiene compatibilidad con URL existentes
import { onMounted, ref } from 'vue';

const route = useRoute();
const pending = ref(true);

onMounted(() => {
  // Redirigir a la versión dinámica
  navigateTo(`${route.path}`);
});
</script>

<style scoped>
.dynamic-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
