<template>
  <div class="w-100" style="overflow-x: hidden;">
    <!-- Estado de carga -->
    <div v-if="loading" class="q-pa-md column" style="min-height: 120px;">
      <q-spinner color="primary" size="3rem" />
      <div class="q-mt-md text-body1 text-grey-7">Cargando contenido...</div>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="q-pa-md column" style="min-height: 120px;">
      <q-icon name="error" color="negative" size="3rem" />
      <div class="text-negative q-mt-md">{{ error }}</div>
    </div>

    <!-- Contenido cargado correctamente -->
    <div v-else>
      <!-- Se eliminó el título para que no aparezca antes del hero banner -->

      <div v-for="(block, index) in blocks" :key="block.id || index" class="q-mb-lg">
        <!-- Renderizado dinámico basado en el tipo de bloque -->
        <component v-if="getComponent(block.type)" :is="getComponent(block.type)" :block="block"
          :api-base-url="apiBaseUrl" />

        <!-- Fallback para tipos desconocidos -->
        <q-card v-else bordered flat class="q-my-md bg-grey-2">
          <q-card-section>
            <div class="text-grey-7 text-center">
              Tipo de bloque no soportado: {{ block.type }}
            </div>
          </q-card-section>
          <q-card-section v-if="debugMode">
            <q-expansion-item label="Detalles del bloque" header-class="text-primary" switch-toggle-side>
              <q-card>
                <q-card-section>
                  <pre class="text-grey-8 bg-grey-1 q-pa-md rounded-borders"
                    style="overflow: auto; max-height: 200px; font-size: 0.8rem;">{{ JSON.stringify(block, null, 2) }}</pre>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWagtailApi } from '~/composables/useWagtailApi';

// Importar el registro centralizado de componentes
import { getComponentByType } from '../registry.js';

// Importamos los componentes utilizados directamente en la plantilla
import ApiImageComponent from '../blocks/ApiImageComponent.vue';
import ApiRichTextComponent from '../blocks/ApiRichTextComponent.vue';
import ApiButtonComponent from '../blocks/ApiButtonComponent.vue';
import ApiHeroBannerComponent from '../blocks/ApiHeroBannerComponent.vue';
import ApiDocumentComponent from '../blocks/ApiDocumentComponent.vue';
import ApiGalleryComponent from '../blocks/ApiGalleryComponent.vue';

const props = defineProps({
  pageData: {
    type: Object,
    default: null
  },
  apiBaseUrl: {
    type: String,
    default: ''
  },
  debugMode: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();
const { getDataFromUrl, loading, error } = useWagtailApi();

// Estado local
const pageContent = ref(props.pageData || null);

// Título de la página
const pageTitle = computed(() => {
  return pageContent.value?.title || '';
});

// Bloques de contenido
const blocks = computed(() => {
  if (!pageContent.value || !pageContent.value.body) {
    return [];
  }
  const arr = Array.isArray(pageContent.value.body)
    ? pageContent.value.body
    : [pageContent.value.body];
  // Filtrar duplicados exactos de tipo y texto enriquecido
  return arr.filter((block, idx, self) => {
    if (!block.value || typeof block.value !== 'object') return true;
    const key = `${block.type}__${block.value.texto || ''}`;
    return self.findIndex(b => b.type === block.type && (b.value?.texto || '') === (block.value.texto || '')) === idx;
  });
});

// Función para obtener el componente adecuado para cada tipo de bloque
const getComponent = (type) => {
  if (!type) return null;

  // Normalizar el tipo (convertir a minúsculas y manejar variantes)
  const normalizedType = type.toLowerCase();

  // Usar la función del registro centralizado
  const component = getComponentByType(normalizedType);

  if (component) {
    // console.log(`Componente encontrado para tipo: ${normalizedType}`);
    return component;
  } else {
    // console.warn(`No se encontró componente para tipo: ${normalizedType}`);
    return null;
  }
};

// Cargar datos si no se proporcionaron como prop
onMounted(async () => {
  if (!props.pageData) {
    try {
      // Intentar obtener datos de la API utilizando la ruta actual
      const path = route.path;
      const apiUrl = `/api/proxy-wagtail?path=${encodeURIComponent(path)}`;

      const data = await getDataFromUrl(apiUrl);
      if (data) {
        pageContent.value = data;
      }
    } catch (err) {
      // console.error('Error al cargar datos de la página:', err);
    }
  }
});
</script>

<!-- Eliminamos todo el CSS personalizado y solo usamos clases de Quasar -->
