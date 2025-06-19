<template>
  <!-- Wrapper exterior para pantalla completa sin ocultar otros componentes -->
  <div class="testimonials-container-fullwidth">
    <!-- Carrusel de testimonios a pantalla completa sin controles -->
    <q-carousel
      v-model="activeSlide"
      animated
      style="width: 100vw; height: 100vh; margin: 0; padding: 0;"
      :autoplay="5000"
      @mouseenter="pauseAutoplay"
      @mouseleave="resumeAutoplay"
      transition-prev="fade"
      transition-next="fade"
      infinite
    >
      <q-carousel-slide 
        v-for="(testimonio, index) in testimonios" 
        :key="index" 
        :name="index"
        class="q-pa-none"
      >
        <!-- Fondo del slide desde la propiedad fondo.url -->
        <div class="absolute-full">
          <q-img 
            :src="getBackgroundUrl(testimonio.fondo)" 
            class="absolute-full"
            fit="cover"
            spinner-color="primary"
            spinner-size="3em"
          >
            <template v-slot:loading>
              <div class="text-white bg-dark flex flex-center absolute-full">
                <q-spinner size="3em" color="primary" />
              </div>
            </template>
            <template v-slot:error>
              <div class="text-white bg-dark flex flex-center absolute-full">
                <div class="column items-center">
                  <q-icon name="error" size="3em" color="negative" />
                  <div class="q-mt-sm">Error al cargar la imagen</div>
                </div>
              </div>
            </template>
            
            <!-- Overlay con gradiente utilizando clases de Quasar -->
            <div class="absolute-full bg-blue-9" style="opacity: 0.85;"></div>
          </q-img>
        </div>
        
        <div class="row items-center justify-between full-height relative-position" style="z-index: 3">
          <!-- Imagen de la persona (lado izquierdo) aún más grande -->
          <div class="col-12 col-md-5 flex flex-center full-height" style="padding: 0;padding-left: 6rem;">
            <q-img
              v-if="testimonio.imagen && testimonio.imagen.url"
              :src="`/api/proxy-image?url=${encodeURIComponent(testimonio.imagen.url)}`"
              spinner-color="primary"
              spinner-size="3em"
              class="testimonial-image"
              style="height: 90vh; max-height: none; width: 100%; max-width: none;"
              fit="cover"
            >
              <template v-slot:loading>
                <q-inner-loading showing>
                  <q-spinner-dots size="3em" color="white" />
                </q-inner-loading>
              </template>
              <template v-slot:error>
                <div class="flex flex-center full-height">
                  <q-icon name="error_outline" color="negative" size="2em" />
                </div>
              </template>
            </q-img>
          </div>
          
          <!-- Cita testimonial (lado derecho) -->
          <div class="col-12 col-md-7 flex flex-center full-height">
            <div class="text-white q-pa-xl" style="max-width: 800px; position: relative;">
              <!-- Texto del testimonio encerrado entre comillas -->
              <div class="flex flex-center items-center full-height">
                <div class="text-center q-px-md">
                  <div class="quote-container">
                    <!-- Comilla de apertura -->
                    <q-icon name="format_quote" size="4rem" color="white" class="rotate-180 quote-open" />
                    
                    <div 
                      class="text-italic text-white text-weight-medium q-my-md quoted-text"
                      :class="{
                        'text-h3': $q.screen.gt.md,
                        'text-h4': $q.screen.gt.sm && $q.screen.lt.lg,
                        'text-h5': $q.screen.lt.md
                      }"
                    >
                      {{ testimonio.comentario }}
                    </div>
                    
                    <!-- Comilla de cierre solo encierra el comentario -->
                    <q-icon name="format_quote" size="4rem" color="white" class="quote-close" />
                  </div>
                  
                  <!-- Información del autor fuera del quote-container -->
                  <div class="text-center q-pt-xl">
                    <div class="text-h5 text-weight-bold">
                      {{ testimonio.nombre }}
                    </div>
                    <div class="text-subtitle1 opacity-80 q-mt-sm">
                      {{ testimonio.organizacion }}{{ testimonio.empresa ? `, ${testimonio.empresa}` : '' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup>
// Ajustar el estilo global para este componente
import { onMounted, onBeforeUnmount } from 'vue';

// Guardar estilos originales para restaurar al desmontar
let originalStyles = {};
let affectedElements = [];

// Asegurar que no haya márgenes en todo el árbol DOM
onMounted(() => {
  // Crear CSS que fuerza el 100% width y elimina todos los márgenes
  const styleEl = document.createElement('style');
  styleEl.id = 'testimonials-full-width-style';
  styleEl.innerHTML = `
    body, html {
      overflow-x: hidden !important;
    }
    .testimonials-container-fullwidth {
      position: relative !important;
      width: 100vw !important;
      height: 100vh !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
      max-width: none !important;
      margin-left: calc(-50vw + 50%) !important;
      overflow: hidden !important;
    }
    .testimonials-container-fullwidth .q-carousel {
      width: 100vw !important;
      height: 100vh !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .testimonials-container-fullwidth * {
      box-sizing: border-box !important;
    }
  `;
  document.head.appendChild(styleEl);
  
  // Guardar el elemento para eliminarlo después
  originalStyles.styleEl = styleEl;
  
  // Encontrar todos los contenedores padre y eliminar restricciones
  const containerElement = document.querySelector('.testimonials-container');
  if (containerElement) {
    // Ir hacia arriba en el DOM y eliminar restricciones
    let parent = containerElement.parentElement;
    while (parent && parent !== document.body) {
      // Guardar estilos originales
      const element = parent;
      affectedElements.push(element);
      originalStyles[element.className || element.id || affectedElements.length] = {
        width: element.style.width,
        maxWidth: element.style.maxWidth,
        margin: element.style.margin,
        padding: element.style.padding,
        overflow: element.style.overflow
      };
      
      // Aplicar nuevos estilos
      element.style.width = '100%';
      element.style.maxWidth = 'none';
      element.style.margin = '0';
      element.style.padding = '0';
      element.style.overflow = 'visible';
      
      parent = parent.parentElement;
    }
  }
});

// Restaurar estilos originales al desmontar el componente
onBeforeUnmount(() => {
  // Eliminar el estilo global
  if (originalStyles.styleEl) {
    originalStyles.styleEl.remove();
  }
  
  // Restaurar estilos originales de elementos afectados
  affectedElements.forEach((element, index) => {
    const key = element.className || element.id || (index + 1);
    if (originalStyles[key]) {
      element.style.width = originalStyles[key].width;
      element.style.maxWidth = originalStyles[key].maxWidth;
      element.style.margin = originalStyles[key].margin;
      element.style.padding = originalStyles[key].padding;
      element.style.overflow = originalStyles[key].overflow;
    }
  });
});

import { ref, computed, onUnmounted } from 'vue';

const props = defineProps({
  block: {
    type: Object,
    default: null
  },
  apiUrl: {
    type: String,
    default: ''
  },
  autoplayDuration: {
    type: Number,
    default: 5000
  },
  title: {
    type: String,
    default: ''
  }
});

// Estado del carrusel
const activeSlide = ref(0);
const autoplayTimeout = ref(null);

// Extraer testimonios del bloque
const testimonios = computed(() => {
  if (props.block?.value?.testimonios) {
    return props.block.value.testimonios;
  }
  return [];
});

// Funciones para controlar el autoplay del carrusel
const pauseAutoplay = () => {
  if (autoplayTimeout.value) {
    clearInterval(autoplayTimeout.value);
    autoplayTimeout.value = null;
  }
};

const resumeAutoplay = () => {
  if (!autoplayTimeout.value && props.autoplayDuration > 0) {
    autoplayTimeout.value = setInterval(() => {
      const nextSlide = (activeSlide.value + 1) % Math.max(1, testimonios.value.length);
      activeSlide.value = nextSlide;
    }, props.autoplayDuration);
  }
};

// Función para obtener URL de imagen de fondo
function getBackgroundUrl(image) {
  if (!image) return '';
  
  if (typeof image === 'string') return image;
  
  if (image && image.url) {
    return `/api/proxy-image?url=${encodeURIComponent(image.url)}`;
  }
  
  return '';
}

// Configurar autoplay al montar el componente
onMounted(() => {
  if (props.autoplayDuration > 0) {
    resumeAutoplay();
  }
});

// Limpiar el timeout al desmontar el componente
onUnmounted(() => {
  pauseAutoplay();
});
</script>

<style>
/* Estilos para pantalla completa sin position: fixed */
.testimonials-container-fullwidth {
  position: relative !important;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  max-width: none !important;
  overflow: hidden !important;
  /* Técnica para centrar y extender a ancho completo */
  margin-left: calc(-50vw + 50%) !important;
}

/* Asegurar que el carrusel ocupe todo el espacio */
.testimonials-container-fullwidth :deep(.q-carousel) {
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* Eliminar cualquier posible margen de elementos contenedores */
.testimonials-container-fullwidth :deep(.q-carousel-slide) {
  margin: 0 !important;
  padding: 0 !important;
  width: 100vw !important;
}

/* Contenedor de citas con posición relativa */
.quote-container {
  position: relative;
  padding: 2rem 3rem;
  margin-bottom: 1rem;
}

/* Estilo para la comilla de apertura */
.quote-open {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.7;
}

/* Estilo para la comilla de cierre */
.quote-close {
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 0.7;
}

/* Estilo para la imagen del testimonio */
.testimonial-image {
  object-position: center;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  border: 4px solid white;
}

/* Estilo para el texto citado */
.quoted-text {
  margin: 2rem;
  position: relative;
  z-index: 2;
}
</style>


