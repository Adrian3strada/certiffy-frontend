<template>
  <section class="api-testimonials-component q-py-md">
    <div class="q-mx-auto" style="max-width: 1200px">
      <h2 v-if="title" class="text-h4 text-center q-mb-lg">{{ title }}</h2>
      
      <!-- Carrusel de testimonios -->
      <q-carousel
        v-model="activeSlide"
        animated
        navigation
        arrows
        height="400px"
        class="testimonials-carousel shadow-3 rounded-borders"
        :autoplay="autoplayDuration"
        @mouseenter="pauseAutoplay"
        @mouseleave="resumeAutoplay"
      >
        <q-carousel-slide 
          v-for="(testimonio, index) in testimonios" 
          :key="index" 
          :name="index"
          class="testimonial-slide q-pa-md"
        >
          <div class="testimonial-container row">
            <!-- Contenido del testimonio (texto e imagen) -->
            <div class="col-12 col-md-8 offset-md-2 text-center">
              <!-- Texto testimonial -->
              <div class="testimonial-text q-mb-md">
                <h3 class="text-h4 text-weight-bold q-mb-md">{{ testimonio.comentario }}</h3>
                
                <!-- Imagen del testimonio -->
                <div class="testimonial-image-container q-mb-md">
                  <q-img
                    v-if="testimonio.imagen && testimonio.imagen.url"
                    :src="`/api/proxy-image?url=${encodeURIComponent(testimonio.imagen.url)}`"
                    class="testimonial-image"
                    :ratio="1"
                    width="200px"
                    height="200px"
                  >
                    <template v-slot:error>
                      <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                        <q-icon name="image" size="3rem" color="grey-7" />
                      </div>
                    </template>
                  </q-img>
                  <div v-else class="testimonial-placeholder flex flex-center">
                    <q-icon name="person" size="3rem" color="grey-6" />
                  </div>
                </div>
                
                <!-- Información del testimonio -->
                <h4 class="text-subtitle1 text-weight-bold q-mb-xs">{{ testimonio.nombre }}</h4>
                <p v-if="testimonio.organizacion" class="text-caption q-mt-none">{{ testimonio.organizacion }}</p>
              </div>
            </div>
          </div>
        </q-carousel-slide>
        
        <!-- Slide por defecto si no hay testimonios -->
        <q-carousel-slide v-if="!testimonios.length" :name="0" class="testimonial-slide q-pa-lg">
          <div class="column items-center justify-center full-height">
            <q-icon name="format_quote" color="grey-5" size="4rem" />
            <p class="text-h5 text-center q-mt-md text-grey-7">No hay testimonios disponibles</p>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { API_BASE_URL } from '~/composables/useWagtailApi';

const props = defineProps({
  block: { 
    type: Object, 
    required: true 
  },
  apiBaseUrl: { 
    type: String, 
    default: API_BASE_URL 
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

// Configurar autoplay al montar el componente
onMounted(() => {
  if (props.autoplayDuration > 0) {
    resumeAutoplay();
  }
});
  </script>
  
  <style scoped>
.api-testimonials-component {
  padding: 2rem 0;
}

.testimonials-carousel {
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--q-grey-1);
}

.testimonial-slide {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.testimonial-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.testimonial-text {
  position: relative;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.testimonial-text h3 {
  font-style: italic;
  position: relative;
  margin-bottom: 2rem;
  padding: 0 30px;
  font-family: serif;
  color: var(--q-primary);
}

.testimonial-text h3::before,
.testimonial-text h3::after {
  content: '\201C'; /* Comilla inicial */
  font-size: 3rem;
  color: var(--q-secondary);
  position: absolute;
  left: 0;
  top: -1.5rem;
}

.testimonial-text h3::after {
  content: '\201D'; /* Comilla final */
  left: auto;
  right: 0;
  top: auto;
  bottom: -2rem;
}

.testimonial-image-container {
  margin: 0 auto;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--q-secondary);
}

.testimonial-image {
  border-radius: 50%;
  object-fit: cover;
}

.testimonial-placeholder {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: var(--q-grey-4);
}

/* Estilos responsivos */
@media (max-width: 768px) {
  .testimonial-text h3 {
    font-size: 1.5rem;
  }
  
  .testimonial-image-container {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 480px) {
  .testimonial-text h3 {
    font-size: 1.2rem;
    padding: 0 15px;
  }
  
  .testimonial-image-container {
    width: 120px;
    height: 120px;
  }
}
</style>
  