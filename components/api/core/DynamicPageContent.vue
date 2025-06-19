<template>
  <div class="q-pa-md q-mx-auto">    
    <!-- Container para los bloques de contenido -->
    <div class="q-col-gutter-md w-100">
      <!-- Si hay body, iteramos por los bloques -->
      <template v-if="pageData.body && Array.isArray(pageData.body)">
        <template v-for="(block, index) in pageData.body" :key="block.id || `block-${block.type}-${index}`">
          <div 
            :class="{
              'full-width q-mb-none': block.type && block.type.toLowerCase() === 'carousel',
              'q-mb-md': !(block.type && block.type.toLowerCase() === 'carousel')
            }"
            :style="{
              width: block.type && block.type.toLowerCase() === 'carousel' ? 'calc(100vw)' : '100%',
              marginLeft: block.type && block.type.toLowerCase() === 'carousel' ? 'calc(-50vw + 50%)' : '0',
              marginRight: block.type && block.type.toLowerCase() === 'carousel' ? 'calc(-50vw + 48%)' : '0', /* Ajuste para cubrir la barra lateral */
              position: block.type && block.type.toLowerCase() === 'carousel' ? 'relative' : 'static',
              left: block.type && block.type.toLowerCase() === 'carousel' ? '0' : 'auto',
              right: block.type && block.type.toLowerCase() === 'carousel' ? '0' : 'auto'
            }"
          >
            <DynamicBlockRenderer 
              :block="block"
              :api-base-url="apiBaseUrl"
            />
          </div>
        </template>
      </template>
      
      <!-- Si no hay body o no es un array, mostramos mensaje -->
      <q-card v-else flat bordered class="text-center q-pa-xl bg-grey-1">
        <q-card-section>
          <q-icon name="info" size="2rem" color="grey-7" />
          <p class="q-mt-sm text-grey-7">Esta página no tiene contenido para mostrar.</p>
        </q-card-section>
        
        <q-card-section v-if="debugMode">
          <q-expansion-item
            label="Datos de la página"
            header-class="text-primary"
            switch-toggle-side
          >
            <q-card>
              <q-card-section>
                <pre class="text-grey-8 bg-grey-2 q-pa-md rounded-borders" style="overflow: auto; max-height: 300px; font-size: 0.8rem;">{{ JSON.stringify(pageData, null, 2) }}</pre>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
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

// Función para contar y registrar los bloques
function logPageBlocks() {
  // console.log('[DynamicPageContent] Datos de página recibidos:', props.pageData);
  // console.log('[DynamicPageContent] Tipo de pageData:', typeof props.pageData);
  // console.log('[DynamicPageContent] pageData tiene body?', !!props.pageData?.body);
  
  if (props.pageData?.body) {
    // console.log('[DynamicPageContent] Tipo de body:', typeof props.pageData.body);
    // console.log('[DynamicPageContent] body es array?', Array.isArray(props.pageData.body));
  }
  
  if (!props.pageData?.body || !Array.isArray(props.pageData.body)) {
    // console.log('[DynamicPageContent] No hay bloques para renderizar o body no es un array');
    // console.log('[DynamicPageContent] Contenido de body:', props.pageData?.body);
    return;
  }
  
  const counts = {};
  // console.log(`[DynamicPageContent] Total de bloques en pageData.body: ${props.pageData.body.length}`);
  
  props.pageData.body.forEach((block, index) => {
    if (block) {
      // console.log(`[DynamicPageContent] Bloque #${index}:`, block);
      
      if (block.type) {
        const type = block.type.toLowerCase();
        counts[type] = (counts[type] || 0) + 1;
        // console.log(`[DynamicPageContent] Bloque #${index}: tipo=${block.type}, id=${block.id}, normalizado=${type}`);
      } else {
        // console.log(`[DynamicPageContent] Bloque #${index} no tiene tipo definido:`, block);
      }
    } else {
      // console.log(`[DynamicPageContent] Bloque #${index} es null o undefined`);
    }
  });
  
  // console.log('[DynamicPageContent] Conteo de bloques por tipo:', counts);
}

// Ejecutar al montar el componente
onMounted(() => {
  logPageBlocks();
});

// Observar cambios en pageData
watch(() => props.pageData, () => {
  // console.log('[DynamicPageContent] pageData ha cambiado, recalculando bloques...');
  logPageBlocks();
}, { deep: true });
</script>

<!-- Se eliminaron todos los estilos personalizados, reemplazados por clases y utilidades de Quasar -->
