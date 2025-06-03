<template>
  <div class="q-mx-auto q-my-sm q-px-sm" style="max-width: 1080px; width: 100%; position: relative;">
    <!-- Depuración si está habilitado -->
    <div v-if="props.debugMode || internalDebugMode" class="q-mb-xs bg-grey-2 rounded-borders q-pa-sm">
      <div class="text-subtitle2 text-primary q-pb-xs">Componente: ApiImagenTextoIzquierda</div>
      <q-toggle v-model="internalDebugMode" label="Mostrar debug interno" dense size="sm" />
      <div v-if="internalDebugMode" class="q-mt-xs">
        <div class="text-caption text-weight-bold">Estructura del bloque:</div>
        <pre class="text-caption q-pa-xs bg-grey-2">{{ JSON.stringify(props.block, null, 2) }}</pre>
        
        <div class="text-caption text-weight-bold q-mt-xs">Variables procesadas:</div>
        <div class="q-pa-xs">imageUrl: <span class="text-primary">{{ imageUrl }}</span></div>
        <div class="q-pa-xs">title: <span class="text-primary">{{ title }}</span></div>
        <div class="q-pa-xs">error: <span class="text-negative">{{ error }}</span></div>
      </div>
    </div>
    
    <!-- Estado de carga -->
    <div v-if="loading" class="full-width flex justify-center items-center" style="min-height: 80px">
      <q-spinner color="primary" size="1.5em" />
      <span class="q-ml-sm text-caption">Cargando...</span>
    </div>
    
    <!-- Estado de error -->
    <div v-else-if="error" class="bg-red-1 rounded-borders q-pa-xs">
      <div class="text-negative text-caption">
        <q-icon name="error" size="1rem" />
        <span class="q-ml-sm">{{ error }}</span>
      </div>
    </div>
    
    <!-- Contenido principal -->
    <div v-else class="row items-center q-col-gutter-md bg-white rounded-borders shadow-1 overflow-hidden">
      <!-- Texto izquierda -->
      <div class="col-12 col-md-7 q-px-md order-2 order-md-1">
        <div v-if="title" class="q-mb-sm">
          <h2 class="text-subtitle1 text-weight-bold text-dark q-mb-xs" style="position: relative; display: inline-block;">
            {{ title }}
            <div class="q-mt-xs bg-primary" style="width: 30px; height: 2px; border-radius: 1px;"></div>
          </h2>
        </div>
        <div v-if="content" class="text-body2 text-grey-8" v-html="content"></div>
      </div>
      
      <!-- Imagen derecha -->
      <div class="col-12 col-md-5 order-1 order-md-2">
        <div class="q-hoverable">
          <q-img 
            :src="imageUrl" 
            :alt="imageAlt" 
            class="rounded-borders shadow-2 q-transition" 
            spinner-color="primary"
            @error="handleImageError"
            :ratio="4/5"
            style="transition: transform 0.3s ease;"
            :class="{'scale-hover': $q.screen.gt.xs}"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  apiBaseUrl: {
    type: String,
    default: process.env.NUXT_PUBLIC_API_BASE || ''
  },
  debugMode: {
    type: Boolean,
    default: false
  }
});

// Variables reactivas
const title = ref('');
const content = ref('');
const imageUrl = ref('');
const imageAlt = ref('');
const loading = ref(false);
const error = ref(null);
const internalDebugMode = ref(false); // Desactivado por defecto, activable con props.debugMode

// Extraer el título si existe en el contenido HTML
const extractTitle = (htmlContent) => {
  try {
    const titleRegex = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i;
    const match = htmlContent.match(titleRegex);
    if (match && match.length > 1) {
      // Encontró un encabezado, lo elimina del contenido y lo devuelve
      content.value = htmlContent.replace(match[0], '');
      return match[1].trim();
    }
    return null;
  } catch (err) {
    console.warn('Error al extraer título:', err);
    return null;
  }
};

// Manejar error al cargar la imagen
const handleImageError = () => {
  console.warn('Error al cargar la imagen');
  error.value = 'Error al cargar la imagen';
};

// Procesar los datos del bloque
onMounted(() => {
  loading.value = true;
  try {
    console.log('Procesando bloque imagen_texto_izquierda:', props.block);
    
    const blockData = props.block.value || props.block;
    if (blockData.texto) {
      const extractedTitle = extractTitle(blockData.texto);
      title.value = extractedTitle || '';
      content.value = blockData.texto;
    } else {
      error.value = 'No se encontró contenido de texto';
    }
    
    if (blockData.imagen) {
      let imgUrl = '';
      if (typeof blockData.imagen === 'string') {
        imgUrl = blockData.imagen;
      } else if (blockData.imagen.url) {
        imgUrl = blockData.imagen.url;
      } else if (blockData.imagen.src) {
        imgUrl = blockData.imagen.src;
      }
      
      if (imgUrl) {
        if (imgUrl.startsWith('/')) {
          imageUrl.value = `/api/proxy-image?url=${encodeURIComponent(props.apiBaseUrl + imgUrl)}`;
        } else {
          imageUrl.value = imgUrl;
        }
      }
      
      if (typeof blockData.imagen === 'object') {
        imageAlt.value = blockData.imagen.alt || blockData.imagen.title || '';
      }
    }
    
    if (!imageUrl.value) {
      error.value = 'No se encontró imagen para mostrar';
    }
    
    console.log('Imagen URL procesada:', imageUrl.value);
    console.log('Título extraído:', title.value);
  } catch (err) {
    console.error('Error al procesar el bloque:', err);
    error.value = 'Error al procesar el bloque: ' + err.message;
    imageUrl.value = '';
    title.value = '';
    content.value = '';
  } finally {
    loading.value = false;
  }
});
</script>


