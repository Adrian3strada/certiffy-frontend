<template>
  <section class="relative-position overflow-hidden" style="height: 100vh; width: 100%">
    <!-- Carrusel de testimonios con diseño moderno -->
    <q-carousel
      v-model="activeSlide"
      animated
      navigation
      arrows
      control-color="white"
      navigation-icon="circle"
      class="full-height"
      :autoplay="autoplayDuration"
      @mouseenter="pauseAutoplay"
      @mouseleave="resumeAutoplay"
      transition-prev="fade"
      transition-next="fade"
      height="100vh"
      flat
    >
      <q-carousel-slide 
        v-for="(testimonio, index) in testimonios" 
        :key="index" 
        :name="index"
        class="relative-position q-pa-none"
        style="height: 100vh"
      >
        <!-- Fondo del slide con degradado para mejorar legibilidad -->
        <div class="absolute-full">
          <q-img 
            :src="getBackgroundUrl(testimonio.fondo || testimonio.imagen)" 
            class="absolute-full"
            fit="cover"
          >
            <!-- Overlay con gradiente para mejorar legibilidad -->
            <div class="absolute-full" style="background: linear-gradient(90deg, rgba(0,0,100,0.85) 0%, rgba(0,0,100,0.7) 50%, rgba(0,0,100,0.5) 100%); z-index: 2;"></div>
          </q-img>
        </div>
        
        <div class="row items-center no-wrap relative-position q-pa-md q-pa-lg-xl full-height" style="z-index: 3">
          <!-- Imagen de la persona (lado izquierdo) -->
          <div class="col-12 col-md-6 flex flex-center full-height q-order-md-none q-order-sm-1" 
               style="height: 40vh; min-height: 40vh">
            <div class="flex justify-center items-center" style="width: 100%; height: 80%">
              <q-img
                v-if="testimonio.imagen && testimonio.imagen.url"
                :src="`/api/proxy-image?url=${encodeURIComponent(testimonio.imagen.url)}`"
                style="max-height: 90vh; max-width: 100%"
                fit="contain"
              />
              <div v-else class="flex flex-center">
                <q-icon name="person" size="15rem" color="white" />
              </div>
            </div>
          </div>
          
          <!-- Cita testimonial (lado derecho) -->
          <div class="col-12 col-md-6 flex flex-center flex-column full-height q-order-md-none q-order-sm-2"
               style="height: 60vh; min-height: 60vh">
            <div class="text-white q-pa-md q-pa-lg-xl" style="max-width: 800px; margin: 0 auto">
              <div class="relative-position q-my-md q-py-xl q-px-md">
                <!-- Comillas de apertura -->
                <div class="absolute-top-left text-white text-opacity-60 text-weight-light" 
                     style="font-size: 7rem; line-height: 1; font-family: 'Georgia', serif; top: -3rem; left: -1rem; z-index: 1;"
                     :class="{'text-h2': $q.screen.lt.md}">
                  &#8220;
                </div>
                
                <!-- Texto del testimonio -->
                <p class="q-ma-none text-italic text-white relative-position text-justify"
                   style="font-size: 2rem; line-height: 1.6; letter-spacing: 0.5px; z-index: 2;"
                   :class="{'text-h5': $q.screen.lt.md, 'text-h6': $q.screen.lt.sm}">
                  {{ testimonio.comentario }}
                </p>
                
                <!-- Comillas de cierre -->
                <div class="absolute-bottom-right text-white text-opacity-60 text-weight-light" 
                     style="font-size: 7rem; line-height: 1; font-family: 'Georgia', serif; bottom: -4rem; right: -1rem; z-index: 1;"
                     :class="{'text-h2': $q.screen.lt.md}">
                  &#8221;
                </div>
              </div>
              
              <!-- Información del autor -->
              <div class="text-right q-pr-lg">
                <p class="q-ma-none text-h5 text-weight-bold" :class="{'text-h6': $q.screen.lt.md}">
                  {{ testimonio.nombre }}
                </p>
                <p class="q-ma-none text-subtitle1 text-white text-opacity-80" :class="{'text-subtitle2': $q.screen.lt.md}">
                  {{ testimonio.organizacion }}{{ testimonio.empresa ? `, ${testimonio.empresa}` : '' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

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
const getBackgroundUrl = (image) => {
  if (image && image.url) {
    return `/api/proxy-image?url=${encodeURIComponent(image.url)}`;
  }
  // Imagen de fondo por defecto (azul)
  return 'https://www.colorhexa.com/0066cc.png';
};

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


