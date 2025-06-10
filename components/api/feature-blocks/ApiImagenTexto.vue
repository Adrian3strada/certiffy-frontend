<template>
  <section 
    :class="[posicionClass, posicionImagen === 'fondo' ? 'imagen-texto-component-full' : 'imagen-texto-component q-py-lg']"
    :id="'imagen-texto-' + (block.id || Math.random().toString(36).substring(2, 9))"
  >
    <!-- Visualización en modo de carga -->
    <div v-if="loading" class="full-width flex flex-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
      <div class="q-ml-sm text-primary text-subtitle1">Cargando...</div>
    </div>

    <!-- Visualización de error -->
    <div v-else-if="error" class="text-negative q-pa-md text-center">
      <q-icon name="error" size="2rem" />
      <div class="q-mt-sm">{{ error }}</div>
    </div>

    <!-- POSICIÓN: FONDO - Imagen como fondo con texto superpuesto (hero banner) -->
    <div v-else-if="posicionImagen === 'fondo'" class="fondo-container">
      <q-img
        :src="imageUrl"
        class="hero-img"
        :ratio="5/1"
        transition="fade"
        spinner-color="primary"
        spinner-size="3em"
        @error="handleImageError"
      >
        <div class="absolute-full flex column justify-center items-center text-center hero-content">
          <div class="content-wrapper text-white">
            <h2 v-if="title" class="hero-title text-h4 q-mb-md">{{ title }}</h2>
            <div class="hero-text" v-html="content"></div>
          </div>
        </div>
      </q-img>
    </div>

    <!-- POSICIÓN: IZQUIERDA - Imagen a la izquierda, texto a la derecha -->
    <div v-else-if="posicionImagen === 'izquierda'" class="izquierda-container q-pa-md">
      <div class="row q-col-gutter-xl items-center">
        <div class="col-12 col-md-5">
          <div class="image-wrapper rounded-borders overflow-hidden">
            <q-img
              :src="imageUrl"
              class="full-width"
              :ratio="4/3"
              transition="fade"
              spinner-color="primary"
              spinner-size="2em"
              @error="handleImageError"
            />
          </div>
        </div>
        <div class="col-12 col-md-7">
          <div class="text-content q-pr-md q-pl-md-none">
            <h2 v-if="title" class="text-h3 text-primary q-mb-md">{{ title }}</h2>
            <div class="text-body1" v-html="content"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- POSICIÓN: DERECHA - Imagen a la derecha, texto a la izquierda -->
    <div v-else-if="posicionImagen === 'derecha'" class="derecha-container q-pa-md">
      <div class="row q-col-gutter-xl items-center reverse">
        <div class="col-12 col-md-5">
          <div class="image-wrapper rounded-borders overflow-hidden">
            <q-img
              :src="imageUrl"
              class="full-width"
              :ratio="4/3"
              transition="fade"
              spinner-color="primary"
              spinner-size="2em"
              @error="handleImageError"
            />
          </div>
        </div>
        <div class="col-12 col-md-7">
          <div class="text-content q-pl-md-none q-pr-md text-right">
            <h2 v-if="title" class="text-h3 text-primary q-mb-md text-right">{{ title }}</h2>
            <div class="text-body1 text-right" v-html="content"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- POSICIÓN: ABAJO - Texto arriba, imagen abajo -->
    <div v-else-if="posicionImagen === 'abajo'" class="abajo-container q-pa-md">
      <div class="row q-col-gutter-lg">
        <div class="col-12">
          <div class="text-content text-center q-mb-xl">
            <h2 v-if="title" class="text-h3 text-primary q-mb-md">{{ title }}</h2>
            <div class="text-body1" v-html="content"></div>
          </div>
        </div>
        <div class="col-12">
          <div class="image-wrapper rounded-borders overflow-hidden">
            <q-img
              :src="imageUrl"
              class="full-width"
              :ratio="21/9"
              transition="fade"
              spinner-color="primary"
              spinner-size="2em"
              @error="handleImageError"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- POSICIÓN: GALERIA - Texto arriba, galería de imágenes abajo -->
    <div v-else-if="posicionImagen === 'galeria'" class="galeria-container q-pa-md">
      <div class="row q-col-gutter-lg">
        <div class="col-12">
          <div class="text-content text-center q-mb-xl">
            <h2 v-if="title" class="text-h3 text-primary q-mb-md">{{ title }}</h2>
            <div class="text-body1" v-html="content"></div>
          </div>
        </div>
        <div class="col-12">
          <div class="row q-col-gutter-md justify-center">
            <!-- Imagen principal, si existe -->
            <div v-if="imageUrl" class="col-12 col-sm-4 col-md-3">
              <div class="image-card">
                <q-img
                  :src="imageUrl"
                  class="full-width"
                  :ratio="1"
                  transition="fade"
                  spinner-color="primary"
                  spinner-size="2em"
                  @error="handleImageError"
                />
              </div>
            </div>
            
            <!-- Galería de imágenes adicionales, si existen -->
            <div 
              v-for="(imagen, index) in imagenes" 
              :key="index" 
              class="col-12 col-sm-4 col-md-3"
            >
              <div class="image-card">
                <q-img
                  :src="getImageUrl(imagen)"
                  class="full-width"
                  :ratio="1"
                  transition="fade"
                  spinner-color="primary"
                  spinner-size="2em"
                  @error="() => handleGaleriaError(index)"
                />
              </div>
            </div>
            
            <!-- Mensaje si no hay imágenes -->
            <div v-if="!imageUrl && (!imagenes || imagenes.length === 0)" class="col-12 text-center text-grey">
              <q-icon name="image_not_supported" size="4rem" />
              <div class="q-mt-sm">No hay imágenes disponibles</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Caso por defecto si no coincide con ninguna posición -->
    <div v-else class="default-container q-pa-md">
      <div class="row q-col-gutter-lg items-center">
        <div class="col-12 col-md-6">
          <div class="image-wrapper rounded-borders overflow-hidden">
            <q-img
              :src="imageUrl"
              class="full-width"
              :ratio="16/9"
              transition="fade"
              spinner-color="primary"
              spinner-size="2em"
              @error="handleImageError"
            />
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="text-content">
            <h2 v-if="title" class="text-h3 text-primary q-mb-md">{{ title }}</h2>
            <div class="text-body1" v-html="content"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';

const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  apiBaseUrl: {
    type: String,
    default: () => {
      const config = useRuntimeConfig();
      return config.public.apiBase || 'http://localhost:3000';
    }
  }
});

// Estados
const loading = ref(true);
const error = ref(null);
const title = ref('');
const content = ref('');
const imageUrl = ref('');
const imagenes = ref([]);

// Computados
const posicionImagen = computed(() => {
  return props.block?.value?.posicion_imagen || 'izquierda';
});

const posicionClass = computed(() => {
  return `posicion-${posicionImagen.value}`;
});

// Extraer título de HTML
const extractTitle = (html) => {
  try {
    if (!html) return '';
    
    const boldMatch = html.match(/<b>([^<]+)<\/b>/);
    const titleRegex = /<h[1-3][^>]*>([^<]+)<\/h[1-3]>/;
    const match = html.match(titleRegex);
    
    if (boldMatch && boldMatch.length > 1) {
      return boldMatch[1].trim();
    }
    else if (match && match.length > 1) {
      return match[1].trim();
    }
    return null;
  } catch (err) {
    console.warn('Error al extraer título:', err);
    return null;
  }
};

// Obtener URL de imagen procesada para la galería
const getImageUrl = (imagen) => {
  try {
    if (!imagen) return '';
    
    let imgUrl = '';
    
    if (typeof imagen === 'string') {
      imgUrl = imagen;
    } else if (imagen.url) {
      imgUrl = imagen.url;
    } else if (imagen.src) {
      imgUrl = imagen.src;
    }
    
    if (!imgUrl) return '';
    
    if (imgUrl.startsWith('/')) {
      return `/api/proxy-image?url=${encodeURIComponent(props.apiBaseUrl + imgUrl)}`;
    }
    
    return imgUrl;
  } catch (error) {
    console.error('Error al procesar URL de imagen:', error);
    return '';
  }
};

// Manejadores de eventos
const handleImageError = () => {
  console.error('Error al cargar la imagen principal');
  error.value = 'No se pudo cargar la imagen';
};

const handleGaleriaError = (index) => {
  console.error(`Error al cargar la imagen de la galería en posición ${index}`);
};

// Inicialización
onMounted(() => {
  loading.value = true;
  try {
    console.log('Procesando bloque ImagenTexto:', props.block);
    
    const blockData = props.block.value || props.block;
    
    // Procesar título y contenido
    if (blockData.titulo) {
      title.value = blockData.titulo;
    }
    
    if (blockData.texto) {
      const extractedTitle = extractTitle(blockData.texto);
      if (extractedTitle && !title.value) {
        title.value = extractedTitle;
      }
      content.value = blockData.texto;
    } else {
      error.value = 'No se encontró contenido de texto';
    }
    
    // Procesar imagen principal
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
    }
    
    // Procesar imágenes de la galería
    if (Array.isArray(blockData.galeria) && blockData.galeria.length > 0) {
      imagenes.value = blockData.galeria;
    } else {
      imagenes.value = [];
    }
    
    loading.value = false;
  } catch (err) {
    console.error('Error al procesar el bloque:', err);
    error.value = 'Error al cargar el componente: ' + err.message;
    loading.value = false;
  }
});
</script>

<style scoped>
/* Estilos generales */
.imagen-texto-component {
  width: 100%;
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
}

.imagen-texto-component-full {
  width: 100%;
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

.text-content {
  font-size: 1.1rem;
  line-height: 1.6;
}

.image-wrapper {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.image-wrapper:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

/* Estilos específicos para FONDO */
.posicion-fondo {
  max-width: 100% !important;
  padding: 0 !important;
}

.fondo-container {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  position: relative;
  left: 0;
  right: 0;
}

.hero-img {
  width: 100%;
}

.hero-content {
  background: rgba(0, 0, 0, 0.4);
  padding: 2rem;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-text {
  font-size: 1.2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Estilos específicos para GALERIA */
.galeria-container .image-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.galeria-container .image-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem !important;
  }
  
  .hero-text {
    font-size: 1rem;
  }
  
  .text-content {
    font-size: 1rem;
    padding: 1rem 0;
  }
}
</style>
