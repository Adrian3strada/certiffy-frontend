<template>
  <div class="wagtail-carousel-block">
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
        v-for="(image, index) in images" 
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
  data: {
    type: Object,
    required: true
  }
});

const slide = ref(0);

// Procesar las imágenes del carrusel
const images = computed(() => {
  if (!props.data || !props.data.value || !Array.isArray(props.data.value)) {
    return [];
  }
  
  return props.data.value.map(item => {
    // Si el item ya tiene una URL, devolverlo tal cual
    if (item.url) return item;
    
    // Si es un objeto con type e id, formatearlo
    return {
      id: item.id || '',
      value: item.value || '',
      type: item.type || 'image'
    };
  });
});
</script>

<style scoped>
.wagtail-carousel-block {
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
