<template>
  <q-page>
    <div class="q-pa-md">
      <h1 class="text-h3 text-center q-my-xl">{{ pageTitle }}</h1>
      
      <!-- Componente principal de noticias -->
      <NoticiasMainComponent :data="noticiasData" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { mockData } from '~/data/mockData';
import NoticiasMainComponent from '~/components/certiffy/noticias-eventos/NoticiasMainComponent.vue';

// Título de la página
const pageTitle = ref(mockData.noticiasEventos.title || 'NOTICIAS Y EVENTOS');

// Obtener datos para el componente de noticias
const noticiasData = computed(() => {
  return mockData.noticiasEventos;
});
</script>
