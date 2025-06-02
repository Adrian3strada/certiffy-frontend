<template>
  <section class="modulos-video-component q-px-md full-width-container">
    <!-- Hero banner con imagen de fondo y título -->
    <div class="hero-banner" :style="{ backgroundImage: heroImageUrl ? `url(${heroImageUrl})` : '' }">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title" v-if="titulo">{{ titulo }}</h1>
      </div>
    </div>
    
    <div class="q-mx-auto container-xl q-mt-lg">
      <!-- Card única que contiene todo el contenido -->
      <q-card class="unified-card shadow-4">
        <div class="row q-pa-xl q-col-gutter-lg justify-between items-center">
          <!-- Columna izquierda: Video o imagen del contenido principal -->
          <div class="col-12 col-md-6">
            <div class="content-principal-container">
              <!-- Video cuando el tipo es "video" -->
              <div v-if="esContenidoVideo" class="video-wrapper">
                <iframe 
                  :src="videoUrl" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                  class="video-iframe"
                ></iframe>
              </div>
              
              <!-- Imagen cuando el tipo es "imagen" -->
              <div v-else-if="esContenidoImagen" class="imagen-principal-wrapper">
                <q-img
                  :src="contenidoPrincipalUrl"
                  :alt="contenidoPrincipalTitle || 'Imagen de módulo'"
                  fit="contain"
                  class="imagen-principal"
                />
              </div>
              
              <!-- Fallback cuando no hay contenido principal -->
              <div v-else class="no-content flex flex-center full-height">
                <q-icon name="image" size="5rem" color="grey-5" />
                <div class="text-grey-7 q-mt-sm">Sin contenido multimedia</div>
              </div>
            </div>
          </div>
          
          <!-- Columna derecha: Descripción y botones -->
          <div class="col-12 col-md-5 content-column">            
            <!-- Descripción del módulo -->
            <p v-if="descripcion" class="content-text q-mb-xl">{{ descripcion }}</p>
            
            <!-- Sección de botones/links -->
            <div v-if="botones && botones.length > 0" class="q-mt-lg">
              <h3 class="links-title">Módulos disponibles:</h3>
              
              <div class="module-links q-gutter-lg q-mt-md">
                <q-btn
                  v-for="(boton, index) in botones"
                  :key="index"
                  :color="getButtonColor(boton.style)"
                  :label="boton.text"
                  class="module-link"
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

<style scoped>
/* Estilos para full-width */
.full-width-container {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow-x: hidden;
  padding-left: 1rem;
  padding-right: 1rem;
}

.modulos-video-component {
  margin-bottom: 3rem;
}

/* Estilos para el hero banner */
.hero-banner {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  margin-bottom: 2rem;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6));
  z-index: 2;
}

.hero-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.hero-title {
  color: white;
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .hero-banner {
    height: 250px;
  }
  
  .hero-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }
}

/* Container más grande */
.container-xl {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

/* Nuevo estilo para card unificada */
.unified-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  background-color: white;
  min-height: 560px;
}

/* Contenedor de imagen principal con fondo personalizado */
.image-featured-container {
  position: relative;
  background-color: rgba(0, 92, 92, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.imagen-principal-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.imagen-principal {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.module-link {
  background-color: #005c5c;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  transition: all 0.3s ease;
  margin: 0.5rem 0.5rem 0.5rem 0;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.module-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  opacity: 0.95;
}

/* Contenedor del contenido principal */
.content-principal-container {
  background-color: rgba(0, 92, 92, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Contenedor de video responsive */
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

/* Estilo para cuando no hay contenido disponible */
.no-content {
  height: 250px;
  width: 100%;
  border-radius: 8px;
  background-color: var(--q-grey-3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Estilos para el contenido */
.content-column {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 1.5rem;
}

.content-text {
  font-size: 1.2rem;
  line-height: 1.7;
  color: #333;
  margin-bottom: 2rem;
  max-width: 95%;
}

/* Título principal de la sección */
.content-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #005c5c;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

/* Título para links/botones */
.links-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #005c5c;
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
}

/* Grid de links/botones */
.module-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Botones personalizados */
.module-links .q-btn {
  min-width: 180px;
  font-weight: 500;
  font-size: 1.1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: #004b4b !important;
  border: none;
}

.module-links .q-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 75, 75, 0.25);
  background-color: #005c5c !important;
}

/* No se necesitan más estilos para video ya que ahora solo mostramos imágenes */

/* Estilos responsivos */
@media (max-width: 991px) {
  .unified-card .row {
    flex-direction: column;
  }
  
  .q-pr-md-lg, .q-pl-md-lg {
    padding-right: 0 !important;
    padding-left: 0 !important;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  
  .content-column {
    margin-top: 1.5rem;
  }
  
  .content-text {
    font-size: 0.95rem;
  }
  
  .links-title {
    font-size: 1rem;
    margin-top: 1rem;
  }
}
</style>