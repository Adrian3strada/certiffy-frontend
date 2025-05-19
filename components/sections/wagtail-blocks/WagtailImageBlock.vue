<template>
  <div class="wagtail-image-block">
    <figure>
      <img 
        :src="imageUrl" 
        :alt="imageAlt" 
        :width="imageWidth" 
        :height="imageHeight"
        class="image"
      />
      <figcaption v-if="imageCaption" class="caption">{{ imageCaption }}</figcaption>
    </figure>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

// Extraer datos de la imagen
const imageUrl = computed(() => {
  if (!props.data || !props.data.value) return 'https://via.placeholder.com/800x400?text=Imagen+no+disponible';
  return props.data.value.url || 'https://via.placeholder.com/800x400?text=Imagen+no+disponible';
});

const imageAlt = computed(() => {
  if (!props.data || !props.data.value) return '';
  return props.data.value.alt || '';
});

const imageWidth = computed(() => {
  if (!props.data || !props.data.value) return null;
  return props.data.value.width || null;
});

const imageHeight = computed(() => {
  if (!props.data || !props.data.value) return null;
  return props.data.value.height || null;
});

const imageCaption = computed(() => {
  if (!props.data || !props.data.value) return '';
  return props.data.value.caption || '';
});
</script>

<style scoped>
.wagtail-image-block {
  margin: 1.5rem 0;
}

figure {
  margin: 0;
  padding: 0;
}

.image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  display: block;
}

.caption {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}
</style>
