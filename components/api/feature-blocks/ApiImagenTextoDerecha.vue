<template>
  <section :id="'imagen-texto-derecha-' + (id || Math.random().toString(36).substring(2, 9))" class="q-mx-auto q-my-sm q-px-sm" style="max-width: 1080px; width: 100%; position: relative;">
    <!-- Depuración si está habilitado -->
    <div v-if="props.debugMode || internalDebugMode" class="q-mb-xs bg-grey-2 rounded-borders q-pa-sm">
      <div class="text-subtitle2 text-primary q-pb-xs">Componente: ApiImagenTextoDerecha</div>
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
      <!-- Imagen izquierda -->
      <div class="col-12 col-md-5">
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
      
      <!-- Texto derecha -->
      <div class="col-12 col-md-7 q-px-md">
        <div v-if="title" class="q-mb-sm">
          <h2 class="text-subtitle1 text-weight-bold text-dark q-mb-xs" style="position: relative; display: inline-block;">
            {{ title }}
            <div class="q-mt-xs bg-primary" style="width: 30px; height: 2px; border-radius: 1px;"></div>
          </h2>
        </div>
        <div v-if="content" class="text-body2 text-grey-8" v-html="content"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFetch, useRuntimeConfig } from '#app'; // Added useRuntimeConfig

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  id: {
    type: String,
    default: ''
  },
  apiBaseUrl: {
    type: String,
    default: () => useRuntimeConfig().public.apiBase
  },
  debugMode: {
    type: Boolean,
    default: false
  }
});

const title = ref('');
const content = ref('');
const imageUrl = ref('');
const imageAlt = ref('');
const loading = ref(false);
const error = ref(null);
const internalDebugMode = ref(false); // Desactivado por defecto, activable con props.debugMode

// Extraer el título si existe en el contenido HTML
const extractTitle = (htmlContent) => {
  if (!htmlContent) return '';
  
  const match = htmlContent.match(/<h[1-3][^>]*>([^<]+)<\/h[1-3]>/);
  if (match && match[1]) {
    return match[1].trim();
  }
  return '';
};

// Procesar datos del bloque
onMounted(() => {
  if (props.debugMode) {
    console.log('ApiImagenTextoDerecha - Datos del bloque:', props.block);
  }
  
  loading.value = true;
  
  try {
    // Asegurarnos de acceder correctamente a los datos del bloque
    const blockData = props.block.value || props.block;
    
    if (props.debugMode) {
      console.log('ApiImagenTextoDerecha - blockData procesado:', blockData);
    }
    
    // Establecer contenido HTML
    if (blockData.texto) {
      // Extraer título si existe en el HTML
      const extractedTitle = extractTitle(blockData.texto);
      title.value = extractedTitle || '';
      content.value = blockData.texto;
    } else {
      // No hay contenido
      error.value = 'No se encontró contenido de texto';
    }
    
    // Procesar imagen - verificamos múltiples estructuras posibles
    if (blockData.imagen) {
      // Verificar estructura exacta de la imagen
      if (props.debugMode) {
        console.log('ApiImagenTextoDerecha - Estructura de imagen:', blockData.imagen);
      }
      
      // Obtener URL de la imagen (contemplando diferentes estructuras)
      let imgUrl = '';
      
      if (typeof blockData.imagen === 'string') {
        // Si es directamente un string
        imgUrl = blockData.imagen;
      } else if (blockData.imagen.url) {
        // Si tiene propiedad url
        imgUrl = blockData.imagen.url;
      } else if (blockData.imagen.src) {
        // Alternativa con src
        imgUrl = blockData.imagen.src;
      }
      
      // Procesar URL
      if (imgUrl) {
        if (imgUrl.startsWith('/')) {
          // Es una ruta relativa, usar proxy
          imageUrl.value = `/api/proxy-image?url=${encodeURIComponent(props.apiBaseUrl + imgUrl)}`;
        } else {
          // Es una URL absoluta
          imageUrl.value = imgUrl;
        }
        
        if (props.debugMode) {
          console.log('ApiImagenTextoDerecha - URL final de imagen:', imageUrl.value);
        }
      }
      
      // Obtener texto alternativo
      if (typeof blockData.imagen === 'object') {
        imageAlt.value = blockData.imagen.alt || blockData.imagen.title || '';
      }
    }
    
    // Si no se encontró ninguna imagen en los datos, mostrar error
    if (!imageUrl.value) {
      error.value = 'No se encontró imagen para mostrar';
      console.log('ApiImagenTextoDerecha - No se encontró imagen');
    }
  } catch (err) {
    console.error('Error al procesar el bloque imagen_texto_derecha:', err);
    error.value = 'Error al procesar el bloque: ' + err.message;
    
    // No mostrar contenido en caso de error
    imageUrl.value = '';
    title.value = '';
    content.value = '';
  } finally {
    loading.value = false;
  }
});

// Manejar error de carga de imagen
const handleImageError = () => {
  console.error('Error al cargar la imagen:', imageUrl.value);
  error.value = 'No se pudo cargar la imagen';
};
</script>


