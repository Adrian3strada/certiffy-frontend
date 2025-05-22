<template>
  <q-page>
    <!-- Componentes de la página "Acerca de" -->
    <MisionComponent class="q-mb-none" :data="datosAcercaDe.mision" />
    <MisionAltComponent class="q-mb-none" :data="datosAcercaDe.misionAlt" />
    <VisionComponent class="q-mb-none" :data="datosAcercaDe.vision" />
    <VisionAltComponent class="q-mb-none" :data="datosAcercaDe.visionAlt" />
    <ValoresComponent class="q-mb-none" :data="datosAcercaDe.valores" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { mockData } from '~/data/mockData';
import { useWagtailApi } from '~/composables/useWagtailApi';
import MisionComponent from '~/components/certiffy/acerca-de/MisionComponent.vue';
import MisionAltComponent from '~/components/certiffy/acerca-de/MisionAltComponent.vue';
import VisionComponent from '~/components/certiffy/acerca-de/VisionComponent.vue';
import VisionAltComponent from '~/components/certiffy/acerca-de/VisionAltComponent.vue';
import ValoresComponent from '~/components/certiffy/acerca-de/ValoresComponent.vue';

// Datos para los componentes
const datosAcercaDe = ref({...mockData.acercaDe});

// Obtener datos de la API de Wagtail
onMounted(async () => {
  try {
    // Intentar obtener datos de la API
    const { fetchAcercaDePage } = useWagtailApi();
    const apiData = await fetchAcercaDePage();
    
    // Si se obtienen datos de la API, actualizar los datos locales
    if (apiData && apiData.acercaDe) {
      datosAcercaDe.value = { ...datosAcercaDe.value, ...apiData.acercaDe };
    }
  } catch (error) {
    console.error('Error al cargar datos de la página Acerca de:', error);
    // En caso de error, seguir usando los datos de mockData
  }
});

// Título de la página para SEO
useHead({
  title: 'Acerca de - Certiffy',
  meta: [
    { name: 'description', content: 'Conoce nuestra misión, visión y valores en Certiffy' }
  ]
});
</script>
