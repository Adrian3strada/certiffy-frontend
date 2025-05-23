<template>
  <section class="q-py-xl q-px-md modulos-video-component">
    <div class="q-mx-auto" style="max-width: 1200px">
      <q-card flat bordered class="q-pa-md q-mb-lg shadow-1">
        <q-card-section>
          <div class="row q-col-gutter-xl">
            <!-- Sección de video -->
            <div class="col-12 col-lg-7 q-mb-md-lg">
              <q-card class="bg-grey-2">
                <div class="video-container q-pa-none">
                  <!-- Miniatura del video con botón de reproducción -->
                  <q-img
                    v-if="!videoActive"
                    :src="thumbnailUrl || placeholderImage"
                    spinner-color="primary"
                    spinner-size="40px"
                    class="rounded-borders video-thumbnail"
                  >
                    <div class="absolute-center">
                      <q-btn
                        round
                        unelevated
                        color="primary"
                        icon="play_arrow"
                        size="lg"
                        @click="activateVideo"
                        class="play-button q-hoverable"
                      />
                    </div>
                  </q-img>
                  
                  <!-- Iframe del video cuando está activo -->
                  <iframe
                    v-if="videoActive"
                    :src="videoEmbedUrl"
                    frameborder="0"
                    allowfullscreen
                    class="video-iframe"
                  ></iframe>
                </div>
                
                <q-card-section v-if="description" class="q-pt-sm description-section">
                  <q-item-label caption class="text-grey-8">{{ description }}</q-item-label>
                </q-card-section>
              </q-card>
            </div>
            
            <!-- Sección de información -->
            <div class="col-12 col-lg-5">
              <q-card-section class="q-px-none info-section">
                <q-item>
                  <q-item-section>
                    <q-item-label class="title-label text-h5 text-weight-bold q-mb-lg">{{ title }}</q-item-label>
                    <q-item-label class="content-text q-mb-md q-pr-sm" v-html="formattedContent"></q-item-label>
                  </q-item-section>
                </q-item>
                
                <!-- Enlaces a módulos -->
                <template v-if="links && links.length > 0">
                  <q-separator class="q-my-md" />
                  
                  <q-item-label header class="links-title text-subtitle1 q-mt-lg">{{ linksTitle }}</q-item-label>
                  
                  <div class="row q-col-gutter-md q-mt-sm links-container">
                    <div 
                      v-for="(link, index) in links" 
                      :key="index"
                      class="col-12 col-sm-6 q-mb-sm"
                    >
                      <q-btn
                        :to="link.url"
                        color="primary"
                        class="module-link full-width text-weight-medium q-py-sm"
                        no-caps
                        unelevated
                        rounded
                      >
                        {{ link.label }}
                      </q-btn>
                    </div>
                  </div>
                </template>
              </q-card-section>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  content: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

// Estado para controlar la reproducción del video
const videoActive = ref(false);

// Props específicos del componente sin valores por defecto
const title = computed(() => props.content.title);
const videoUrl = computed(() => props.content.videoUrl);
const thumbnailUrl = computed(() => props.content.thumbnailUrl);
const description = computed(() => props.content.description);
const richText = computed(() => props.content.richText);
const links = computed(() => props.content.links);
const linksTitle = computed(() => props.content.linksTitle);

// Imagen de respaldo - esta propiedad se usa solo internamente en el componente
const placeholderImage = computed(() => props.content.placeholderImage);

// Convertir URL de YouTube a URL de embed
const videoEmbedUrl = computed(() => {
  const url = videoUrl.value;
  if (!url) return '';
  
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } else if (url.includes('youtu.be')) {
    const videoId = url.split('youtu.be/')[1];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } else if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1];
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  }
  
  return url;
});

// Formatear el contenido para aplicar estilos
const formattedContent = computed(() => {
  return richText.value;
});

// Activar el video
const activateVideo = () => {
  videoActive.value = true;
};
</script>

<style scoped>
.modulos-video-component .video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}

.modulos-video-component .video-thumbnail,
.modulos-video-component .video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modulos-video-component .play-button {
  transform: scale(1.2);
  transition: all 0.3s ease;
}

.modulos-video-component .play-button:hover {
  transform: scale(1.4);
}

/* Estilos responsivos para dispositivos móviles */
@media (max-width: 599px) {
  .modulos-video-component .title-label {
    font-size: 1.25rem !important;
    margin-bottom: 1rem !important;
  }
  
  .modulos-video-component .content-text {
    font-size: 0.9rem !important;
  }
  
  .modulos-video-component .description-section {
    padding: 8px !important;
  }
  
  .modulos-video-component .info-section {
    padding: 12px 0 !important;
  }
  
  .modulos-video-component .links-title {
    font-size: 1rem !important;
    margin-top: 0.5rem !important;
  }
  
  .modulos-video-component .module-link {
    font-size: 0.8rem !important;
    padding: 6px 12px !important;
  }
  
  .modulos-video-component .play-button {
    transform: scale(1);
  }
}

/* Ajustes para tablets */
@media (min-width: 600px) and (max-width: 1023px) {
  .modulos-video-component .title-label {
    font-size: 1.5rem !important;
    margin-bottom: 1.25rem !important;
  }
  
  .modulos-video-component .content-text {
    font-size: 0.95rem !important;
  }
  
  .modulos-video-component .q-mb-md-lg {
    margin-bottom: 24px;
  }
}
</style>
