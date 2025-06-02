<template>
  <div class="imagen-encima-texto-container">
    <!-- Depuración si está habilitado -->
    <div v-if="props.debugMode || internalDebugMode" class="debug-info q-mb-xs">
      <div class="text-subtitle2 text-primary q-pb-xs">Componente: ApiImagenEncimaTexto</div>
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
    <div v-else-if="error" class="error-container q-pa-xs">
      <div class="text-negative text-caption">
        <q-icon name="error" size="1rem" />
        <span class="q-ml-sm">{{ error }}</span>
      </div>
    </div>
    
    <!-- Contenido principal -->
    <div v-else class="content-card">
      <!-- Imagen arriba -->
      <div class="imagen-container">
        <img 
          :src="imageUrl" 
          :alt="imageAlt" 
          class="imagen-principal" 
          @error="handleImageError"
        />
      </div>
      
      <!-- Texto abajo -->
      <div class="texto-container">
        <h2 v-if="title" class="titulo-seccion">{{ title }}</h2>
        <div v-if="content" class="content-text" v-html="content"></div>
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
    if (!htmlContent) return '';
    
    // Buscar etiquetas de título en el HTML
    const boldMatch = htmlContent.match(/<b>([^<]+)<\/b>/);
    const titleRegex = /<h[1-3][^>]*>([^<]+)<\/h[1-3]>/;
    const match = htmlContent.match(titleRegex);
    
    if (boldMatch && boldMatch.length > 1) {
      // Encontró un texto en negrita, lo considera como título
      return boldMatch[1].trim();
    }
    else if (match && match.length > 1) {
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
    console.log('Procesando bloque imagen_encima_texto:', props.block);
    
    const blockData = props.block.value || props.block;
    if (blockData.texto) {
      // Intentar extraer título del contenido HTML
      const extractedTitle = extractTitle(blockData.texto);
      title.value = extractedTitle || '';
      // Si se encontró un título, eliminarlo del contenido si es un título estándar
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
    title.value = '';
    content.value = '';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.imagen-encima-texto-container {
  margin: 1rem auto;
  position: relative;
  max-width: 900px;
  width: 100%;
  padding: 0 0.5rem;
}

.content-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.imagen-container {
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
}

.imagen-principal {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.content-card:hover .imagen-principal {
  transform: scale(1.03);
}

.texto-container {
  padding: 1.25rem 1.5rem;
}

.titulo-seccion {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #263238;
  position: relative;
}

.content-text {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #455a64;
}

.content-text p {
  margin-bottom: 0.75rem;
}

.content-text b, .content-text strong {
  color: #1f2937;
  font-weight: 600;
}

/* Estilo para debug */
.debug-info {
  font-size: 0.7rem;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  padding: 0.25rem;
  margin-bottom: 0.25rem;
}

/* Estilo para error */
.error-container {
  font-size: 0.75rem;
  background: rgba(255, 0, 0, 0.03);
  border-radius: 4px;
  padding: 0.25rem;
}

@media (max-width: 767px) {
  .imagen-encima-texto-container {
    margin: 0.75rem auto;
    padding: 0 0.25rem;
  }
  
  .texto-container {
    padding: 1rem;
  }
  
  .titulo-seccion {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .content-text {
    font-size: 0.85rem;
    line-height: 1.4;
  }
}
</style>
