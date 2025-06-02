<template>
  <div>
    <!-- Usamos DynamicPageWrapper para mostrar la página principal (ID: 3) -->
    <DynamicPageWrapper :pageId="3" />
  </div>
</template>

<script setup>
import DynamicPageWrapper from '~/components/api/core/DynamicPageWrapper.vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

// Si en el futuro necesitamos cualquier lógica adicional para
// la página principal, la colocaremos aquí
</script>
