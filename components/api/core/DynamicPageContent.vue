<template>
  <div class="dynamic-page-content q-pa-md">    
    <!-- Container para los bloques de contenido -->
    <div class="content-blocks q-col-gutter-md">
      <!-- Si hay body, iteramos por los bloques -->
      <template v-if="pageData.body && Array.isArray(pageData.body)">
        <template v-for="(block, index) in pageData.body" :key="index">
          <div :class="[
            block.type && block.type.toLowerCase() === 'carousel' ? 'carousel-block q-mb-none' : 'content-block q-mb-md'
          ]">
            <DynamicBlockRenderer 
              :block="block"
              :api-base-url="apiBaseUrl"
            />
          </div>
        </template>
      </template>
      
      <!-- Si no hay body o no es un array, mostramos mensaje -->
      <div v-else class="text-center q-pa-xl">
        <q-icon name="info" size="2rem" color="grey-7" />
        <p class="q-mt-sm text-grey-7">Esta página no tiene contenido para mostrar.</p>
        <pre v-if="debugMode" class="debug-info q-mt-sm">{{ JSON.stringify(pageData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import DynamicBlockRenderer from './DynamicBlockRenderer.vue';

const props = defineProps({
  pageData: {
    type: Object,
    required: true
  },
  pageId: {
    type: [Number, String],
    required: false
  }
});

// Configuración de la API
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBase || '';

// Modo debug para desarrollo
const debugMode = computed(() => {
  return process.env.NODE_ENV === 'development';
});
</script>

<style scoped>
.dynamic-page-content {
  max-width: 1200px;
  margin: 0 auto;
}

.content-blocks {
  width: 100%;
}

.carousel-block {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 48%); /* Ajuste para cubrir la barra lateral */
  position: relative;
  left: 0;
  right: 0;
}

.debug-info {
  font-size: 0.8rem;
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
  color: #666;
}
</style>
