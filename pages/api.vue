<template>
  <!-- Redirigir a la página dinámica -->
  <DynamicPageWrapper :pageId="3" />
</template>

<script setup>
import DynamicPageWrapper from '~/components/api/core/DynamicPageWrapper.vue';
</script>
