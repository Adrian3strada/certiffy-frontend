<template>
  <div class="wagtail-carousel-component">
    <q-carousel
      v-model="slide"
      animated
      arrows
      navigation
      infinite
      height="400px"
      class="carousel shadow-2 rounded-borders"
    >
      <q-carousel-slide 
        v-for="(image, index) in carouselImages" 
        :key="image.id || index"
        :name="index"
        class="column no-wrap flex-center"
      >
        <div class="carousel-item">
          <!-- Si tenemos una URL de imagen real -->
          <img 
            v-if="image.url"
            :src="image.url" 
            :alt="image.alt || `Imagen ${index + 1}`" 
            class="carousel-image"
          />
          <!-- Si solo tenemos un ID o valor de imagen -->
          <div v-else class="carousel-placeholder">
            <div class="placeholder-content">
              <q-icon name="mdi-image" size="3rem" color="grey-7" />
              <div class="q-mt-sm">Imagen {{ index + 1 }}</div>
              <div class="q-mt-xs text-caption">
                ID: {{ image.id || 'N/A' }}
                <br>
                Valor: {{ image.value || 'N/A' }}
              </div>
            </div>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  content: {
    type: Object,
    default: () => ({
      images: [
        { url: 'https://via.placeholder.com/800x400?text=Slide+1', alt: 'Slide 1' },
        { url: 'https://via.placeholder.com/800x400?text=Slide+2', alt: 'Slide 2' },
        { url: 'https://via.placeholder.com/800x400?text=Slide+3', alt: 'Slide 3' }
      ],
      id: 'carousel-sample'
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});

const slide = ref(0);

// Procesar las imágenes del carrusel
const carouselImages = computed(() => {
  // Manejar diferentes estructuras de datos posibles
  let images = [];
  
  // Si content.images existe y es un array
  if (props.content.images && Array.isArray(props.content.images)) {
    images = props.content.images;
  }
  // Si content.value existe y es un array (formato de la API)
  else if (props.content.value && Array.isArray(props.content.value)) {
    images = props.content.value;
  }
  // Si content es un array directamente (otro formato posible)
  else if (Array.isArray(props.content)) {
    images = props.content;
  }
  // Si no hay imágenes, devolver un array vacío
  else {
    return [];
  }
  
  // Mapear las imágenes para asegurar un formato consistente
  return images.map(item => {
    // Si el item ya tiene una URL, devolverlo con formato estándar
    if (item.url) {
      return {
        url: item.url,
        alt: item.alt || '',
        id: item.id || `img-${Math.random().toString(36).substring(2, 10)}`
      };
    }
    
    // Si es un objeto con type e id (formato de la API de Wagtail)
    return {
      id: item.id || '',
      value: item.value || '',
      type: item.type || 'image'
    };
  });
});
</script>

<style scoped>
.wagtail-carousel-component {
  margin: 1.5rem 0;
}

.carousel {
  background-color: #f5f5f5;
}

.carousel-item {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.carousel-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
}

.placeholder-content {
  text-align: center;
  color: #666;
}
</style>
