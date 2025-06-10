<template>
  <section class="q-py-xl modulos-certiffy" style="width: 100vw; margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 48%); background-color: #f5f5f5; overflow-x: hidden;">
    <div class="q-container q-mx-auto q-px-md" style="max-width: 1200px;">
      <!-- Título de la sección -->
      <h2 class="text-center text-primary text-weight-bold q-mb-md" v-if="tituloSeccion">{{ tituloSeccion }}</h2>
      
      <!-- Texto principal -->
      <div class="text-center q-mb-xl" v-if="textoPrincipal" v-html="textoPrincipal"></div>
            <!-- Módulos con imágenes y botones -->
            <div class="row q-col-gutter-lg justify-center q-mt-xl">
        <div v-for="(modulo, index) in modulos" :key="index" class="col-12 col-sm-4">
          <div class="modulo-card q-pa-md flex flex-center column items-center">
            <!-- Imagen del módulo -->
            <q-img
              :src="getImageUrl(modulo.imagen)"
              :alt="modulo.imagen?.title || 'Icono del módulo'"
              :ratio="1"
              spinner-color="primary"
              class="q-mb-md modulo-imagen"
              style="max-width: 180px; width: 100%; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.08);"
            />
            
            <!-- Botón del módulo -->
            <q-btn
              :label="modulo.titulo"
              color="primary"
              class="full-width modulo-boton"
              :to="formatEnlace(modulo.enlace)"
              no-caps
              unelevated
            />
          </div>
        </div>
      </div>
      <!-- Sección del video -->
      <div v-if="videoUrl" class="q-mb-xl">
        <div class="video-container" style="max-width: 900px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <iframe
            :src="videoUrl"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="width: 100%; aspect-ratio: 16/9;"
          ></iframe>
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

// Texto principal (HTML)
const textoPrincipal = computed(() => {
  return props.block?.value?.texto_principal || '';
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

<style scoped>
.modulos-certiffy {
  position: relative;
  padding: 4rem 0;
  background-color: #f5f5f5;
}

.modulos-certiffy h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--q-primary);
}

/* Contenedor de video */
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* Estilos para los módulos */
.modulo-card {
  background-color: white;
  border-radius: 12px;
  transition: all 0.3s ease;
  height: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
}

.modulo-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modulo-imagen {
  transition: transform 0.3s ease;
  width: 80%;
  max-width: 160px;
  margin-bottom: 1.5rem;
  border-radius: 8px;
}

.modulo-card:hover .modulo-imagen {
  transform: scale(1.05);
}

/* Estilo de botones */
.modulo-boton {
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modulo-boton:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Estilos responsivos */
@media (max-width: 767px) {
  .modulos-certiffy h2 {
    font-size: 1.6rem;
  }
  
  .modulo-card {
    margin-bottom: 1.5rem;
    padding: 1.5rem 1rem;
  }
  
  .modulo-imagen {
    max-width: 120px;
    margin-bottom: 1rem;
  }
}

.q-btn {
  transition: all 0.2s ease;
}

.q-btn:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.25) !important;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  .col-lg-8 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  .col-lg-4 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>