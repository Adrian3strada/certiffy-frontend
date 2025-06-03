<template>
  <section class="q-px-md q-mb-xl" style="width: 100vw; position: relative; left: 50%; right: 50%; margin-left: -50vw; margin-right: -50vw; overflow-x: hidden;">
    <!-- Hero banner con imagen de fondo y título -->
    <div class="relative-position" style="height: 300px; overflow: hidden; margin-bottom: 2rem;" :style="{ backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : '', backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }">
      <div class="absolute-full" style="background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)); z-index: 2;"></div>
      <div class="absolute-full flex flex-center" style="z-index: 3;">
        <h1 class="text-white text-center text-weight-bold q-ma-none" style="font-size: 2.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);" v-if="titulo">{{ titulo }}</h1>
      </div>
    </div>
    
    <div class="q-mx-auto q-mt-lg" style="max-width: 1200px;">
      <!-- Card única que contiene todo el contenido -->
      <q-card class="shadow-4 q-border-radius-md">
        <div class="row q-pa-xl q-col-gutter-lg justify-between items-center">
          <!-- Columna izquierda: Video o imagen del contenido principal -->
          <div class="col-12 col-md-6">
            <div>
              <!-- Video cuando el tipo es "video" -->
              <div v-if="esContenidoVideo" class="relative-position" style="padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
                <iframe 
                  :src="videoUrl" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                  class="absolute-full"
                  style="border: none;"
                ></iframe>
              </div>
              
              <!-- Imagen cuando el tipo es "imagen" -->
              <div v-else-if="esContenidoImagen" class="q-px-md">
                <q-img
                  :src="contenidoPrincipalUrl"
                  :alt="contenidoPrincipalTitle || 'Imagen de módulo'"
                  fit="contain"
                  style="max-height: 400px; width: 100%;"
                />
              </div>
              
              <!-- Fallback cuando no hay contenido principal -->
              <div v-else class="flex flex-center" style="height: 300px;">
                <div class="text-center">
                  <q-icon name="image" size="5rem" color="grey-5" />
                  <div class="text-grey-7 q-mt-sm">Sin contenido multimedia</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Columna derecha: Descripción y botones -->
          <div class="col-12 col-md-5">
            <!-- Descripción del módulo -->
            <p v-if="descripcion" class="text-body1 q-mb-xl">{{ descripcion }}</p>
            
            <!-- Sección de botones/links -->
            <div v-if="botones && botones.length > 0" class="q-mt-lg">
              <div class="text-h5 text-certiffy-azul text-weight-bold q-mb-md" style="font-family: 'OpenSans-Bold', sans-serif;">Módulos disponibles:</div>
              
              <div class="q-gutter-lg q-mt-md">
                <q-btn
                  v-for="(boton, index) in botones"
                  :key="index"
                  :color="getButtonColor(boton.style)"
                  :label="boton.text"
                  class="q-transition"
                  :class="{'q-hoverable': true}"
                  @click="openLink(boton.url)"
                  no-caps
                  rounded
                  unelevated
                  size="large"
                  padding="md lg"
                />
              </div>
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { API_BASE_URL } from '~/composables/useWagtailApi';

const router = useRouter();

const props = defineProps({
  block: {
    type: Object,
    default: null
  },
  apiUrl: {
    type: String,
    default: ''
  }
});

// URL para el Hero Banner (imagen de fondo principal)
const heroImageUrl = computed(() => {
  const imagen = props.block?.value?.imagen;
  if (!imagen || !imagen.url) return null;
  
  const imagenUrl = imagen.url;
  
  // Siempre usar el proxy para evitar problemas de CORS
  if (imagenUrl.startsWith('/')) {
    return `/api/proxy-image?url=${encodeURIComponent(API_BASE_URL + imagenUrl)}`;
  } else if (imagenUrl.startsWith('http')) {
    return `/api/proxy-image?url=${encodeURIComponent(imagenUrl)}`;
  } else {
    return `/api/proxy-image?url=${encodeURIComponent(API_BASE_URL + '/' + imagenUrl)}`;
  }
});

// Verificar si el contenido principal es un video
const esContenidoVideo = computed(() => {
  const contenidoPrincipal = props.block?.value?.contenido_principal;
  return contenidoPrincipal && contenidoPrincipal.tipo === 'video';
});

// Verificar si el contenido principal es una imagen
const esContenidoImagen = computed(() => {
  const contenidoPrincipal = props.block?.value?.contenido_principal;
  return contenidoPrincipal && contenidoPrincipal.tipo === 'imagen';
});

// URL del video (cuando es de tipo video)
const videoUrl = computed(() => {
  const contenidoPrincipal = props.block?.value?.contenido_principal;
  if (!esContenidoVideo.value || !contenidoPrincipal.video_url) return null;
  
  return contenidoPrincipal.video_url;
});

// URL de la imagen para el contenido principal (cuando es de tipo imagen)
const contenidoPrincipalUrl = computed(() => {
  const contenidoPrincipal = props.block?.value?.contenido_principal;
  if (!esContenidoImagen.value || !contenidoPrincipal.imagen_url) return null;
  
  const imagenUrl = contenidoPrincipal.imagen_url;
  
  // Siempre usar el proxy para evitar problemas de CORS
  if (imagenUrl.startsWith('/')) {
    return `/api/proxy-image?url=${encodeURIComponent(API_BASE_URL + imagenUrl)}`;
  } else if (imagenUrl.startsWith('http')) {
    return `/api/proxy-image?url=${encodeURIComponent(imagenUrl)}`;
  } else {
    return `/api/proxy-image?url=${encodeURIComponent(API_BASE_URL + '/' + imagenUrl)}`;
  }
});

// Título de la imagen del contenido principal
const contenidoPrincipalTitle = computed(() => {
  const contenidoPrincipal = props.block?.value?.contenido_principal;
  if (esContenidoImagen.value) {
    return contenidoPrincipal?.imagen_title || '';
  } else if (esContenidoVideo.value) {
    return contenidoPrincipal?.video_caption || '';
  }
  return '';
});

// Título del componente (para la sección de contenido)
const titulo = computed(() => {
  return props.block?.value?.titulo || '';
});

// Descripción del componente
const descripcion = computed(() => {
  return props.block?.value?.descripcion || '';
});

// Botones disponibles
const botones = computed(() => {
  return props.block?.value?.botones || [];
});

// Función para manejar los clics en botones
const openLink = (url) => {
  // Abrir links internos con el router y externos en nueva pestaña
  if (url && url.startsWith('http')) {
    window.open(url, '_blank');
  } else {
    router.push(url);
  }
};

// Función para determinar el color del botón según el estilo
const getButtonColor = (style) => {
  switch (style) {
    case 'primary':
      return 'primary';
    case 'secondary':
      return 'secondary';
    case 'accent':
      return 'accent';
    case 'info':
      return 'info';
    default:
      return 'primary';
  }
};
</script>