<template>
  <section class="modern-testimonial-component">
    <!-- Carrusel de testimonios con diseño moderno -->
    <q-carousel
      v-model="activeSlide"
      animated
      navigation
      arrows
      control-color="white"
      navigation-icon="circle"
      class="testimonial-hero-carousel"
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
        class="testimonial-slide"
      >
        <!-- Fondo del slide con degradado para mejorar legibilidad -->
        <div class="testimonial-background">
          <q-img 
            :src="getBackgroundUrl(testimonio.fondo || testimonio.imagen)" 
            class="fullscreen-bg"
            fit="cover"
          >
            <div class="bg-overlay"></div>
          </q-img>
        </div>
        
        <div class="testimonial-content-container row items-center no-wrap">
          <!-- Imagen de la persona (lado izquierdo) -->
          <div class="col-12 col-md-6 person-image-column">
            <div class="person-image-container">
              <q-img
                v-if="testimonio.imagen && testimonio.imagen.url"
                :src="`/api/proxy-image?url=${encodeURIComponent(testimonio.imagen.url)}`"
                class="person-image"
                fit="contain"
              />
              <div v-else class="person-placeholder">
                <q-icon name="person" size="15rem" color="white" />
              </div>
            </div>
          </div>
          
          <!-- Cita testimonial (lado derecho) -->
          <div class="col-12 col-md-6 testimonial-text-column">
            <div class="testimonial-text">
              <div class="quote-wrapper">
                <div class="opening-quote">&#8220;</div>
                <p class="testimonial-quote">{{ testimonio.comentario }}</p>
                <div class="closing-quote">&#8221;</div>
              </div>
              <div class="testimonial-author">
                <p class="author-name">{{ testimonio.nombre }}</p>
                <p class="author-title">{{ testimonio.organizacion }}{{ testimonio.empresa ? `, ${testimonio.empresa}` : '' }}</p>
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

<style scoped>
.modern-testimonial-component {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.testimonial-hero-carousel {
  height: 100vh;
}

.testimonial-slide {
  position: relative;
  height: 100vh;
  width: 100%;
  padding: 0;
}

/* Fondo a pantalla completa */
.testimonial-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.fullscreen-bg {
  position: absolute;
  height: 100%;
  width: 100%;
}

/* Overlay para mejorar legibilidad de texto */
.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(0,0,100,0.85) 0%, rgba(0,0,100,0.7) 50%, rgba(0,0,100,0.5) 100%);
  z-index: 2;
}

/* Contenedor de contenido */
.testimonial-content-container {
  position: relative;
  z-index: 3;
  height: 100%;
  padding: 2rem;
}

/* Estilos de la imagen de la persona */
.person-image-column {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.person-image-container {
  width: 100%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.person-image {
  max-height: 90vh;
  max-width: 100%;
  object-fit: contain;
}

/* Estilos de texto testimonial */
.testimonial-text-column {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.testimonial-text {
  color: white;
  position: relative;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.quote-wrapper {
  position: relative;
  margin: 1.5rem 0 3rem;
  padding: 0 3rem;
}

.opening-quote,
.closing-quote {
  font-size: 7rem;
  line-height: 1;
  font-family: 'Georgia', serif;
  position: absolute;
  color: rgba(255, 255, 255, 0.6);
  z-index: 1;
}

.opening-quote {
  top: -3rem;
  left: -1rem;
}

.closing-quote {
  bottom: -4rem;
  right: -1rem;
}

.testimonial-quote {
  font-size: 2rem;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
  letter-spacing: 0.5px;
  text-align: justify;
  position: relative;
  z-index: 2;
  font-style: italic;
}

.testimonial-author {
  margin-top: 1.5rem;
  text-align: right;
  padding-right: 3rem;
}

.author-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.author-title {
  font-size: 1.1rem;
  font-weight: 400;
  margin: 0;
  opacity: 0.8;
}

/* Estilos responsivos */
@media (max-width: 767px) {
  .testimonial-content-container {
    flex-direction: column !important;
    padding: 1rem;
  }
  
  .person-image-column {
    height: 40vh;
    order: 1;
  }
  
  .testimonial-text-column {
    height: 60vh;
    order: 2;
  }
  
  .person-image {
    max-height: 40vh;
  }
  
  .testimonial-quote {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }
  
  .quote-wrapper {
    padding: 0 2rem;
    margin: 1rem 0 2.5rem;
  }
  
  .opening-quote {
    top: -2rem;
    left: -0.5rem;
    font-size: 5rem;
  }
  
  .closing-quote {
    bottom: -3rem;
    right: -0.5rem;
    font-size: 5rem;
  }
  
  .testimonial-author {
    padding-right: 1rem;
  }
}

@media (max-width: 480px) {
  .testimonial-quote {
    font-size: 1.4rem;
  }
  
  .author-name {
    font-size: 1.3rem;
  }
  
  .author-title {
    font-size: 1rem;
  }
}
</style>
