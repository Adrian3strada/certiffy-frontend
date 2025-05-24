<template>
  <div>
    <ApiContentComponent 
      :apiUrl="apiUrl"
      :carouselHeightMobile="'320px'"
      :carouselHeightTablet="'420px'"
      :carouselHeightDesktop="'520px'"
      :autoplayDuration="4000"
      :showCarousel="true"
      :showParagraphs="true"
      :showVideo="true"
      :customImageUrlFunction="getCustomImageUrl"
      @data-loaded="handleDataLoaded"
      @data-error="handleDataError"
      @video-loaded="handleVideoLoaded"
      @video-error="handleVideoError"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import ApiContentComponent from '~/components/api/ApiContentComponent.vue';

// URL de la API que funciona con Postman (asegurando que sea la ruta correcta)
const apiUrl = ref('https://693d-2806-103e-1d-30e0-88bf-2d33-4e9f-2e8e.ngrok-free.app/api/v2/pages/3/?format=json');

// Función personalizada para obtener la URL de la imagen
const getCustomImageUrl = (imageId) => {
  // Usar imágenes locales o de placeholder
  return `https://via.placeholder.com/800x450?text=Imagen+Dinámica+${imageId}`;
};

// Manejadores de eventos para datos
const handleDataLoaded = (data) => {
  console.log('Datos cargados correctamente:', data);
};

const handleDataError = (error) => {
  console.error('Error al cargar los datos:', error);
};

// Manejadores de eventos para video
const handleVideoLoaded = (videoData) => {
  console.log('Video cargado correctamente:', videoData);
};

const handleVideoError = (error) => {
  console.error('Error al cargar el video:', error);
};

onMounted(() => {
  console.log('Componente API montado con datos de ejemplo');
});
</script>
