<template>
  <div class="wagtail-block-component">
    <div v-if="loading" class="loading-container">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm">Cargando bloque de contenido...</div>
    </div>
    
    <div v-else-if="error" class="error-container">
      <q-icon name="mdi-alert" color="negative" size="2em" />
      <div class="q-mt-sm">{{ error }}</div>
    </div>
    
    <div v-else-if="blockData" class="content-container">
      <!-- Indicador de datos de respaldo -->
      <div v-if="usingMockData" class="mock-data-indicator q-mb-md">
        <q-banner class="bg-amber-2 text-black">
          <template v-slot:avatar>
            <q-icon name="mdi-information-outline" color="amber-9" />
          </template>
          Usando datos de ejemplo. La API de Wagtail aún no está disponible.
        </q-banner>
      </div>
      
      <!-- Renderizado dinámico del bloque según su tipo -->
      <component 
        :is="blockComponent" 
        v-if="blockComponent" 
        :data="blockData" 
      />
      
      <!-- Fallback para tipos de bloques desconocidos -->
      <div v-else class="unknown-block-type">
        <q-banner class="bg-blue-2 text-black">
          <template v-slot:avatar>
            <q-icon name="mdi-information-outline" color="blue-9" />
          </template>
          Tipo de bloque desconocido: {{ content.blockType }}
        </q-banner>
        
        <pre class="q-mt-md">{{ JSON.stringify(blockData, null, 2) }}</pre>
      </div>
    </div>
    
    <div v-else class="empty-container">
      <q-icon name="mdi-information-outline" color="grey" size="2em" />
      <div class="q-mt-sm">No hay datos disponibles</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';

// Importar componentes de bloques específicos
import WagtailHeadingBlock from './wagtail-blocks/WagtailHeadingBlock.vue';
import WagtailRichTextBlock from './wagtail-blocks/WagtailRichTextBlock.vue';
import WagtailImageBlock from './wagtail-blocks/WagtailImageBlock.vue';
import WagtailVideoBlock from './wagtail-blocks/WagtailVideoBlock.vue';
import WagtailCarouselBlock from './wagtail-blocks/WagtailCarouselBlock.vue';

const $q = useQuasar();

const props = defineProps({
  content: {
    type: Object,
    default: () => ({
      blockType: 'richtext',
      blockId: 'sample-block',
      apiUrl: null,
      mockData: null
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});

const loading = ref(true);
const error = ref(null);
const blockData = ref(null);
const usingMockData = ref(false);

// Mapeo de tipos de bloques a componentes
const blockComponentMap = {
  'heading': WagtailHeadingBlock,
  'richtext': WagtailRichTextBlock,
  'image': WagtailImageBlock,
  'video': WagtailVideoBlock,
  'carousel': WagtailCarouselBlock
};

// Determinar qué componente usar para renderizar el bloque
const blockComponent = computed(() => {
  if (!props.content.blockType) return null;
  return blockComponentMap[props.content.blockType] || null;
});

// Datos de respaldo para diferentes tipos de bloques
const mockDataMap = {
  'heading': {
    type: 'heading',
    value: {
      text: 'Título de ejemplo',
      level: 2,
      id: 'sample-heading'
    }
  },
  'richtext': {
    type: 'richtext',
    value: '<p>Este es un texto de ejemplo para mostrar cómo se vería un bloque de texto enriquecido de Wagtail.</p><p>Puede contener <strong>negrita</strong>, <em>cursiva</em> y otros formatos.</p>'
  },
  'image': {
    type: 'image',
    value: {
      url: 'https://via.placeholder.com/800x400',
      alt: 'Imagen de ejemplo',
      width: 800,
      height: 400,
      caption: 'Esta es una imagen de ejemplo'
    }
  },
  'video': {
    type: 'video',
    value: {
      url: 'https://www.youtube.com/watch?v=X6dM7OjHNsE',
      caption: 'Video de ejemplo'
    }
  },
  'carousel': {
    type: 'carousel',
    value: [
      {
        type: 'image',
        value: 1,
        id: 'cea1b6f6-d630-428a-95b1-b380b9bcff0c'
      },
      {
        type: 'image',
        value: 2,
        id: 'd4d701bf-2bdc-43e9-9d44-d5f4b0e5fe4f'
      },
      {
        type: 'image',
        value: 3,
        id: '483251f4-d522-4905-8575-edf765784cc8'
      }
    ]
  }
};

// Cargar datos del bloque
const loadBlockData = async () => {
  loading.value = true;
  error.value = null;
  usingMockData.value = false;
  
  try {
    // Si hay una URL de API específica, intentar cargar desde allí
    if (props.content.apiUrl) {
      try {
        const response = await fetch(props.content.apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const responseText = await response.text();
        
        try {
          const data = JSON.parse(responseText);
          blockData.value = data;
          console.log('Datos cargados de la API:', data);
          return;
        } catch (jsonError) {
          console.error('Error al analizar JSON:', jsonError);
          throw new Error('La API no devolvió un JSON válido');
        }
      } catch (apiError) {
        console.error('Error al cargar desde la API:', apiError);
        // Continuar con los datos de respaldo
      }
    }
    
    // Si hay datos de respaldo específicos proporcionados en las props
    if (props.content.mockData) {
      blockData.value = props.content.mockData;
      usingMockData.value = true;
      console.log('Usando datos de respaldo personalizados:', blockData.value);
      return;
    }
    
    // Usar datos de respaldo predeterminados según el tipo de bloque
    if (props.content.blockType && mockDataMap[props.content.blockType]) {
      blockData.value = mockDataMap[props.content.blockType];
      usingMockData.value = true;
      console.log('Usando datos de respaldo predeterminados:', blockData.value);
      return;
    }
    
    // Si no hay datos disponibles
    error.value = 'No se pudieron cargar los datos del bloque';
    
  } catch (err) {
    console.error('Error al cargar datos del bloque:', err);
    error.value = `Error: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

// Observar cambios en las props
watch(() => props.content, () => {
  loadBlockData();
}, { deep: true });

// Cargar datos al montar el componente
onMounted(() => {
  loadBlockData();
});
</script>

<style scoped>
.wagtail-block-component {
  width: 100%;
  padding: 1rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.error-container {
  color: #c10015;
}

.empty-container {
  color: #9e9e9e;
}

.content-container {
  width: 100%;
}

pre {
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
