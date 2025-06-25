<template>
  <section class="certiffy-modules-section q-py-md bg-grey-1">
    <div class="certiffy-modules-container">
      <!-- Título de la sección -->
      <h2 class="certiffy-modules-title text-primary text-weight-bold q-mb-md" v-if="tituloSeccion">{{ tituloSeccion }}</h2>
      
      <!-- Texto principal con alineación configurable -->
      <div 
        class="certiffy-modules-intro q-mb-md text-body1" 
        v-if="textoInfo" 
        v-html="textoInfo.texto"
        :style="{ textAlign: textoInfo.alineacion || 'center' }"
      ></div>
      
      <!-- Módulos con imágenes y botones (sin efecto de tarjeta) -->
      <div class="row q-col-gutter-xl justify-center items-stretch certiffy-modules-row q-mb-md">
        <div v-for="(modulo, index) in modulos" :key="index" class="col-12 col-sm-4">
          <div class="certiffy-module-item flex flex-center column items-center q-pa-md">
            <!-- Imagen del módulo con sombra sutil -->
            <q-img
              :src="getImageUrl(modulo.imagen)"
              :alt="modulo.imagen?.title || 'Icono del módulo'"
              :ratio="1"
              spinner-color="primary"
              class="certiffy-module-image q-mb-lg full-width rounded-borders"
              style="border-radius: 12px"
            />
            
            <!-- Botón del módulo -->
            <q-btn
              :label="modulo.titulo"
              color="primary"
              class="certiffy-module-button q-px-lg"
              :to="formatEnlace(modulo.enlace)"
              no-caps
              unelevated
              rounded
            />
          </div>
        </div>
      </div>
      
      <!-- Sección del video (mismo ancho que los módulos) -->
      <div v-if="videoUrl" class="q-my-md certiffy-video-section">
        <div class="certiffy-video-container q-mt-lg q-mb-xl">
          <div class="certiffy-video-wrapper">
            <iframe
              :src="videoUrl"
              class="certiffy-video-frame"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRuntimeConfig } from '#app';

const router = useRouter();
const runtimeConfig = useRuntimeConfig();

// Props del componente
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  block: {
    type: Object,
    default: null
  },
  apiUrl: {
    type: String,
    default: ''
  }
});

// Título de la sección
const tituloSeccion = computed(() => {
  return props.block?.value?.titulo_seccion || 'Plataforma Certiffy';
});

// Texto principal con alineación (objeto con texto y alineación)
const textoInfo = computed(() => {
  return props.block?.value?.texto || null;
});

// URL del video de YouTube o otro proveedor
const videoUrl = computed(() => {
  return props.block?.value?.video_url || '';
});

// Módulos de Certiffy
const modulos = computed(() => {
  return props.block?.value?.modulos || [];
});

// Función para obtener la URL de la imagen con proxy cuando sea necesario
const getImageUrl = (imagen) => {
  if (!imagen || !imagen.url) return '';
  
  const imagenUrl = imagen.url;
  
  // Usar proxy para imágenes relativas que requieren la API base
  if (imagenUrl.startsWith('/')) {
    return `/api/proxy-image?url=${encodeURIComponent(runtimeConfig.public.apiBase + imagenUrl)}`;
  } else if (imagenUrl.startsWith('http')) {
    return imagenUrl; // URL absoluta, no necesita proxy
  } else {
    return `/api/proxy-image?url=${encodeURIComponent(runtimeConfig.public.apiBase + '/' + imagenUrl)}`;
  }
};

// Formatear enlace para el router (quitar domain para enlaces internos)
const formatEnlace = (url) => {
  if (!url) return '/';
  
  // Si es una URL absoluta con el dominio de la API, convertirla a ruta relativa
  if (url.includes('localhost:8000')) {
    // Quitar el dominio y puerto para tener solo la ruta
    return url.split('localhost:8000')[1] || '/';
  }
  
  // Si es una URL externa completa, usarla tal cual
  if (url.startsWith('http')) {
    return url;
  }
  
  // Para rutas relativas, usarlas directamente
  return url;
};
</script>

<style>
/* Las clases específicas para este componente ahora se cargan desde el archivo */
@import '~/assets/css/modules-video.css';
</style>