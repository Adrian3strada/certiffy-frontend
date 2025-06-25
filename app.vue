<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useLanguageRerender } from '~/composables/useLanguageRerender';

const { rerenderKey } = useLanguageRerender();
</script>

<style>
/* Estilos globales */
</style>

