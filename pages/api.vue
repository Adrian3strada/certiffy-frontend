<template>
  <div>
    <div v-if="pending">
      <q-spinner-dots color="primary" size="3em" />
      <p>Cargando datos de API...</p>
    </div>
    <div v-else-if="error">
      <q-banner class="bg-negative text-white">
        Error al cargar la página: {{ error.message }}
      </q-banner>
    </div>
    <div v-else>
      <component
        v-if="pageData && pageData.body"
        :is="dynamicBlockRendererComponent"
        :blocks="pageData.body"
      />
    </div>
  </div>
</template>

<script setup>
import { shallowRef, defineAsyncComponent } from 'vue';
import { useWagtail } from '~/composables/useWagtail';

// Cargar el componente de renderizado dinámicamente
const dynamicBlockRendererComponent = shallowRef(defineAsyncComponent(() => 
  import('~/components/api/core/DynamicBlockRenderer.vue')
));

// Obtener datos de la página por ID
const { fetchPageDetails } = useWagtail();
const { data: pageData, pending, error } = await useAsyncData('apiPage', 
  () => fetchPageDetails(3),
  { server: true }
);
</script>
