<template>
  <div class="imagen-texto-derecha-container">
    <!-- Depuración si está habilitado -->
    <div v-if="props.debugMode || internalDebugMode" class="debug-info q-mb-xs">
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
    <div v-else-if="error" class="error-container q-pa-xs">
      <div class="text-negative text-caption">
        <q-icon name="error" size="1rem" />
        <span class="q-ml-sm">{{ error }}</span>
      </div>
    </div>
    
    <!-- Contenido principal -->
    <div v-else class="custom-layout">
      <!-- Imagen izquierda en formato más rectangular -->
      <div class="imagen-lado">
        <img 
          :src="imageUrl" 
          :alt="imageAlt" 
          class="imagen-normal" 
          @error="handleImageError"
        />
      </div>
      
      <!-- Texto derecha -->
      <div class="texto-lado">
        <h2 v-if="title" class="text-subtitle1 text-weight-bold titulo-seccion">{{ title }}</h2>
        <div v-if="content" class="content-text" v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFetch } from '#app';

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

<style scoped>
.imagen-texto-derecha-container {
  margin: 0.5rem auto;
  position: relative;
  max-width: 1080px;
  width: 100%;
  padding: 0 0.5rem;
}

/* Nuevo layout personalizado */
.custom-layout {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.imagen-lado {
  flex: 0 0 45%;
  position: relative;
  overflow: hidden;
  max-height: none;
  display: flex;
  align-items: center;
}

.texto-lado {
  flex: 0 0 62%;
  padding: 1rem 1.25rem 1rem 0.5rem;
}

/* Estilos para la imagen estándar */
.imagen-normal {
  width: 100%;
  height: auto;
  aspect-ratio: 4/5;
  object-fit: fill;
  display: block;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.imagen-lado:hover .imagen-normal {
  transform: scale(1.02);
}

.titulo-seccion {
  position: relative;
  display: inline-block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #263238;
  font-size: 1rem;
}

.titulo-seccion::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--q-primary);
  border-radius: 1px;
}

.content-text {
  font-size: 0.85rem;
  line-height: 1.4;
  color: #455a64;
}

.content-text p {
  margin-bottom: 0.5rem;
}

.content-text a {
  color: var(--q-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.content-text a:hover {
  color: var(--q-secondary);
  text-decoration: underline;
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
  .imagen-texto-derecha-container {
    margin: 0.5rem auto;
    padding: 0 0.25rem;
  }
  
  .custom-layout {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .imagen-lado {
    flex: 0 0 100%;
    width: 100%;
  }
  
  .texto-lado {
    flex: 0 0 100%;
    width: 100%;
    padding: 0.75rem 0.5rem;
  }
  
  .imagen-normal {
    max-height: 180px;
  }
  
  .titulo-seccion {
    font-size: 0.9rem;
  }
  
  .content-text {
    font-size: 0.8rem;
    line-height: 1.3;
  }
}
</style>
