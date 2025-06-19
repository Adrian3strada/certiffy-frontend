<template>
  <section 
    :class="[$q.screen.lt.md ? 'q-py-md' : 'q-py-xl', posicionImagen === 'fondo' ? '' : 'q-px-md']"
    :style="posicionImagen === 'fondo' ? 'width: 100%; overflow: hidden; padding: 0; margin: 0;' : 'max-width: 1200px; margin: 0 auto; overflow: hidden;'"
    :id="'imagen-texto-' + (block.id || Math.random().toString(36).substring(2, 9))"
  >
    <!-- Visualización en modo de carga -->
    <div v-if="loading" class="full-width flex flex-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
      <div class="q-ml-sm text-primary text-subtitle1">Cargando...</div>
    </div>

    <!-- Visualización de error -->
    <div v-else-if="error" class="bg-red-1 text-negative flex flex-center column items-center q-pa-md rounded-borders">
      <q-icon name="error" size="2rem" />
      <div class="q-mt-sm">{{ error }}</div>
    </div>

    <!-- POSICIÓN: FONDO - Imagen como fondo con texto superpuesto (hero banner) -->
    <div v-else-if="posicionImagen === 'fondo'" class="full-width" style="position: relative; left: 0; right: 0;">
      <q-img
        :src="imageUrl"
        class="full-width"
        :ratio="5/1"
        transition="fade"
        spinner-color="primary"
        spinner-size="3em"
        @error="handleImageError"
      >
        <div class="absolute-full flex column justify-center items-center text-center" 
             style="background: rgba(0, 0, 0, 0.4); padding: 2rem;">
          <div class="q-mx-auto q-pa-lg bg-black-6" style="max-width: 800px; border-radius: 8px;">
            <h2 v-if="title" class="text-h3 text-white text-weight-bold q-mb-md" 
                :class="alineacionClass"
                style="text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);"
                v-html="title">
            </h2>
            <div class="text-body1 text-white" :class="alineacionClass" v-html="content"></div>
          </div>
        </div>
      </q-img>
    </div>

    <!-- POSICIÓN: IZQUIERDA - Imagen a la izquierda, texto a la derecha -->
    <div v-else-if="posicionImagen === 'izquierda'" class="q-pa-md">
      <div class="row q-col-gutter-xl items-center">
        <div class="col-12 col-md-5">
          <q-card class="q-hoverable" style="border-radius: 8px; overflow: hidden;">
            <q-img
              :src="imageUrl"
              class="full-width"
              :ratio="4/3"
              transition="fade"
              spinner-color="primary"
              spinner-size="2em"
              @error="handleImageError"
            />
          </q-card>
        </div>
        <div class="col-12 col-md-7">
          <div class="q-pr-md q-pl-md-none">
            <h2 v-if="title" class="text-h3 text-primary q-mb-md">{{ title }}</h2>
            <div class="text-body1" v-html="content"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- POSICIÓN: DERECHA - Imagen a la derecha, texto a la izquierda -->
    <div v-else-if="posicionImagen === 'derecha'" class="q-pa-md">
      <div class="row q-col-gutter-xl items-center reverse">
        <div class="col-12 col-md-5">
          <q-card class="q-hoverable" style="border-radius: 8px; overflow: hidden;">
            <q-img
              :src="imageUrl"
              class="full-width"
              :ratio="4/3"
              transition="fade"
              spinner-color="primary"
              spinner-size="2em"
              @error="handleImageError"
            />
          </q-card>
        </div>
        <div class="col-12 col-md-7">
          <div class="q-pl-md-none q-pr-md text-right">
            <h2 v-if="title" class="text-h3 text-primary q-mb-md text-right">{{ title }}</h2>
            <div class="text-body1 text-right" v-html="content"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- POSICIÓN: ABAJO - Texto arriba, imagen abajo -->
    <div v-else-if="posicionImagen === 'abajo'" class="q-pa-md">
      <div class="row q-col-gutter-lg">
        <div class="col-12">
          <div class="text-center q-mb-xl" :class="alineacionClass">
            <h2 v-if="title" class="text-h3 text-primary q-mb-md">{{ title }}</h2>
            <div class="text-body1" v-html="content"></div>
          </div>
        </div>
        <div class="col-12">
          <q-card class="q-hoverable" style="border-radius: 8px; overflow: hidden;">
            <q-img
              :src="imageUrl"
              class="full-width"
              :ratio="21/9"
              transition="fade"
              spinner-color="primary"
              spinner-size="2em"
              @error="handleImageError"
            />
          </q-card>
        </div>
      </div>
    </div>

    <!-- POSICIÓN: ARRIBA - Texto arriba, imagen abajo -->
    <div v-else-if="posicionImagen === 'arriba'" class="q-pa-md">
      <div class="row q-col-gutter-lg">
        <div class="col-12">
          <div :class="['q-mb-xl', alineacionClass]">
            <h2 v-if="title" class="text-h3 text-primary q-mb-md">{{ title }}</h2>
            <div class="text-body1" v-html="content"></div>
          </div>
        </div>
        <div class="col-12">
          <q-card class="q-hoverable" style="border-radius: 8px; overflow: hidden;">
            <q-img
              :src="imageUrl"
              class="full-width"
              :ratio="21/9"
              transition="fade"
              spinner-color="primary"
              spinner-size="2em"
              @error="handleImageError"
            />
          </q-card>
        </div>
      </div>
    </div>

    <!-- POSICIÓN: GALERIA - Texto arriba, galería de imágenes abajo -->
    <div v-else-if="posicionImagen === 'galeria'" class="q-pa-md">
      <div class="row q-col-gutter-lg">
        <div class="col-12">
          <div :class="['q-mb-xl', alineacionClass]">
            <h2 v-if="title" class="text-h3 text-primary q-mb-md" v-html="title"></h2>
            <div class="text-body1" v-html="content"></div>
          </div>
        </div>
        <div class="col-12">
          <div class="row q-col-gutter-md justify-center">
            <!-- Imagen principal, si existe -->
            <div v-if="imageUrl" class="col-12 col-sm-6 col-md-4 gallery-item">
              <q-card 
                class="gallery-card cursor-pointer" 
                @click="openLightbox(0)"
              >
                <q-img
                  :src="imageUrl"
                  class="full-width"
                  :ratio="4/3"
                  transition="fade"
                  spinner-color="primary"
                  spinner-size="2em"
                  @error="handleImageError"
                >
                  <div class="absolute-bottom text-subtitle2 text-center bg-black-6 text-white q-pa-xs">
                    <q-icon name="zoom_in" /> Click para ampliar
                  </div>
                </q-img>
              </q-card>
            </div>
            
            <!-- Galería de imágenes adicionales, si existen -->
            <div 
              v-for="(imagen, index) in imagenes" 
              :key="index" 
              class="col-12 col-sm-6 col-md-4 gallery-item"
            >
              <q-card 
                class="gallery-card cursor-pointer" 
                @click="openLightbox(imageUrl ? index + 1 : index)"
              >
                <q-img
                  :src="getImageUrl(imagen)"
                  class="full-width"
                  :ratio="4/3"
                  transition="fade"
                  spinner-color="primary"
                  spinner-size="2em"
                  @error="() => handleGaleriaError(index)"
                >
                  <div class="absolute-bottom text-subtitle2 text-center bg-black-6 text-white q-pa-xs">
                    <q-icon name="zoom_in" /> Click para ampliar
                  </div>
                </q-img>
              </q-card>
            </div>
            
            <!-- Mensaje si no hay imágenes -->
            <div v-if="!imageUrl && (!imagenes || imagenes.length === 0)" class="col-12 text-center text-grey">
              <q-icon name="image_not_supported" size="4rem" />
              <div class="q-mt-sm">No hay imágenes disponibles</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Lightbox para ver imágenes ampliadas -->
    <q-dialog
      v-model="lightboxOpen"
      maximized
      persistent
      transition-show="fade"
      transition-hide="fade"
    >
      <div class="fullscreen bg-black flex flex-center">
        <div class="absolute-top-right q-pa-md">
          <q-btn
            icon="close"
            round
            flat
            color="white"
            class="bg-black-4"
            @click="lightboxOpen = false"
          />
        </div>
        
        <q-carousel
          v-model="lightboxSlide"
          animated
          swipeable
          infinite
          navigation
          arrows
          class="full-width"
          style="height: 90vh;"
        >
          <q-carousel-slide 
            v-if="imageUrl" 
            :name="0" 
            class="flex flex-center"
          >
            <div class="full-height full-width flex flex-center">
              <img 
                :src="imageUrl" 
                style="max-height: 85vh; max-width: 90vw; object-fit: contain;" 
                alt="Imagen ampliada"
              />
            </div>
          </q-carousel-slide>
          
          <q-carousel-slide 
            v-for="(imagen, index) in imagenes" 
            :key="index" 
            :name="imageUrl ? index + 1 : index" 
            class="flex flex-center"
          >
            <div class="full-height full-width flex flex-center">
              <img 
                :src="getImageUrl(imagen)" 
                style="max-height: 85vh; max-width: 90vw; object-fit: contain;" 
                alt="Imagen ampliada"
              />
              <div v-if="imagen.title" class="absolute-bottom text-center bg-black-6 text-white q-pa-md full-width">
                {{ imagen.title }}
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </q-dialog>
    </div>

    <!-- Caso por defecto si no coincide con ninguna posición -->
    <div v-else class="q-pa-md">
      <div class="row q-col-gutter-lg items-center">
        <div class="col-12 col-md-6">
          <q-card class="q-hoverable" style="border-radius: 8px; overflow: hidden;">
            <q-img
              :src="imageUrl"
              class="full-width"
              :ratio="16/9"
              transition="fade"
              spinner-color="primary"
              spinner-size="2em"
              @error="handleImageError"
            />
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <div class="q-pa-md" :class="alineacionClass">
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

// Estados para el lightbox
const lightboxOpen = ref(false);
const lightboxSlide = ref(0);

// Computados
const posicionImagen = computed(() => {
  return props.block?.value?.posicion_imagen || 'izquierda';
});

const posicionClass = computed(() => {
  return `certiffy-posicion-${posicionImagen.value}`;
});

// Alineación del texto (nuevo campo)
const alineacionTexto = computed(() => {
  return props.block?.value?.alineacion_texto || 'center';
});

const alineacionClass = computed(() => {
  switch (alineacionTexto.value) {
    case 'left':
      return 'text-left';
    case 'right':
      return 'text-right';
    case 'center':
    default:
      return 'text-center';
  }
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

// Método para abrir el lightbox
const openLightbox = (slideIndex) => {
  lightboxSlide.value = slideIndex;
  lightboxOpen.value = true;
  console.log(`Abriendo lightbox en slide ${slideIndex}`);
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
    
    // Procesar imágenes
    // Primero procesamos el array de imágenes
    if (Array.isArray(blockData.imagenes) && blockData.imagenes.length > 0) {
      console.log('Encontradas imágenes en array:', blockData.imagenes);
      imagenes.value = blockData.imagenes;
      
      // Usar la primera imagen como imagen principal si no hay una específica
      if (!imageUrl.value) {
        const primeraImagen = blockData.imagenes[0];
        let imgUrl = '';
        
        if (typeof primeraImagen === 'string') {
          imgUrl = primeraImagen;
        } else if (primeraImagen.url) {
          imgUrl = primeraImagen.url;
        } else if (primeraImagen.src) {
          imgUrl = primeraImagen.src;
        }
        
        if (imgUrl) {
          if (imgUrl.startsWith('/')) {
            imageUrl.value = `/api/proxy-image?url=${encodeURIComponent(props.apiBaseUrl + imgUrl)}`;
          } else {
            imageUrl.value = imgUrl;
          }
          console.log('Imagen principal establecida desde array:', imageUrl.value);
        }
      }
    } else if (Array.isArray(blockData.galeria) && blockData.galeria.length > 0) {
      // Compatibilidad con formato anterior
      console.log('Encontradas imágenes en galería:', blockData.galeria);
      imagenes.value = blockData.galeria;
    } else {
      imagenes.value = [];
    }
    
    // Procesar imagen principal específica si existe
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
        console.log('Imagen principal establecida desde campo imagen:', imageUrl.value);
      }
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
.gallery-card {
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.gallery-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.gallery-item {
  margin-bottom: 1.5rem;
}

.lightbox-card {
  background: rgba(0, 0, 0, 0.9);
  border-radius: 0;
}

.lightbox-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
  padding: 0;
  margin: 0;
}

.lightbox-direct-image {
  object-fit: contain;
  max-height: 85vh;
  max-width: 100%;
  height: auto;
  width: 100%;
  display: block;
  margin: 0 auto;
}

/* Estilos responsivos para la galería */
@media (max-width: 599px) {
  .gallery-item {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>
