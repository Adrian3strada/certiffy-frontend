<template>
  <section class="testimonials-component q-py-xl bg-blue-1">
    <div class="q-mx-auto" style="max-width: 1200px">
      <div class="q-px-md q-pt-md q-pb-xl">
        <div class="row justify-center">
          <div class="col-12 col-md-10 col-lg-8">
            
            <!-- Carrusel de testimonios -->
            <q-card flat bordered class="testimonial-card shadow-1 bg-white q-pa-none">
              <q-carousel
                v-model="slide"
                swipeable
                animated
                arrows
                navigation
                infinite
                padding
                :height="carouselHeight"
                control-color="primary"
                :autoplay="autoplay"
                @mouseenter="autoplay = false"
                @mouseleave="autoplay = 5000"
                class="rounded-borders"
              >
                <q-carousel-slide v-for="(testimonial, index) in testimonials" :key="index" :name="index" class="q-pa-lg flex flex-center carousel-slide">
                  <q-card flat class="bg-transparent text-center testimonial-content">
                    <q-card-section>
                      <div class="q-mb-md quote-icon">
                        <q-icon name="format_quote" color="primary" size="3rem" />
                      </div>
                      
                      <div class="testimonial-text text-h5 q-mb-lg text-weight-medium text-dark">{{ testimonial.frase }}</div>
                      
                      <div class="q-mt-lg author-info">
                        <div class="author-name text-subtitle1 text-weight-bold">{{ testimonial.autor }}</div>
                        <div v-if="testimonial.organizacion" class="organization text-caption text-grey-8">{{ testimonial.organizacion }}</div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-carousel-slide>
              </q-carousel>
            </q-card>
            
            <div class="row justify-center q-mt-md navigation-buttons">
              <div class="col-auto">
                <q-btn
                  round
                  flat
                  dense
                  color="primary"
                  icon="chevron_left"
                  @click="prevSlide"
                  class="nav-button q-mx-xs"
                />
                <q-btn
                  round
                  flat
                  dense
                  color="primary"
                  icon="chevron_right"
                  @click="nextSlide"
                  class="nav-button q-mx-xs"
                />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  testimonials: {
    type: Array,
    required: true
  }
});

const slide = ref(0);
const autoplay = ref(5000);
const windowWidth = ref(window.innerWidth);

// Ajustar la altura del carrusel según el tamaño de la pantalla
const carouselHeight = computed(() => {
  if (windowWidth.value < 600) {
    return '400px';
  } else if (windowWidth.value < 1024) {
    return '380px';
  } else {
    return '350px';
  }
});

// Actualizar el ancho de la ventana cuando cambia el tamaño
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// Agregar y eliminar el event listener para el cambio de tamaño
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const nextSlide = () => {
  if (slide.value < props.testimonials.length - 1) {
    slide.value++;
  } else {
    slide.value = 0;
  }
};

const prevSlide = () => {
  if (slide.value > 0) {
    slide.value--;
  } else {
    slide.value = props.testimonials.length - 1;
  }
};
</script>

<style scoped>
.testimonials-component .testimonial-card {
  transition: all 0.3s ease;
}

.testimonials-component .quote-icon {
  transition: transform 0.3s ease;
}

.testimonials-component .carousel-slide:hover .quote-icon {
  transform: scale(1.1);
}

.testimonials-component .nav-button {
  transition: transform 0.2s ease;
}

.testimonials-component .nav-button:hover {
  transform: scale(1.2);
}

/* Estilos responsivos para dispositivos móviles */
@media (max-width: 599px) {
  .testimonials-component .testimonial-text {
    font-size: 1.1rem !important;
    line-height: 1.5 !important;
    margin-bottom: 1rem !important;
  }
  
  .testimonials-component .quote-icon q-icon {
    font-size: 2rem !important;
  }
  
  .testimonials-component .author-name {
    font-size: 0.9rem !important;
  }
  
  .testimonials-component .organization {
    font-size: 0.8rem !important;
  }
  
  .testimonials-component .carousel-slide {
    padding: 12px !important;
  }
}

/* Ajustes para tablets */
@media (min-width: 600px) and (max-width: 1023px) {
  .testimonials-component .testimonial-text {
    font-size: 1.3rem !important;
    line-height: 1.6 !important;
  }
  
  .testimonials-component .author-name {
    font-size: 1rem !important;
  }
}
</style>