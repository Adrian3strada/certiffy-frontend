<template>
  <section class="q-py-xl q-px-md">
    <div class="q-mx-auto" style="max-width: 1200px">
      <q-card flat bordered class="q-pa-md q-mb-lg shadow-1">
        <q-card-section>
          <div class="row q-col-gutter-xl">
            <!-- Sección de video -->
            <div class="col-12 col-md-7">
              <q-card class="bg-grey-2">
                <div class="q-pa-none" style="position: relative; padding-bottom: 56.25%; height: 0;">
                  <!-- Miniatura del video con botón de reproducción -->
                  <q-img
                    v-if="!videoActive"
                    :src="thumbnailUrl || placeholderImage"
                    spinner-color="primary"
                    spinner-size="40px"
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                    class="rounded-borders"
                  >
                    <div class="absolute-center">
                      <q-btn
                        round
                        unelevated
                        color="primary"
                        icon="play_arrow"
                        size="lg"
                        @click="activateVideo"
                        class="q-hoverable"
                        style="transform: scale(1.2); transition: all 0.3s ease;"
                      />
                    </div>
                  </q-img>
                  
                  <!-- Iframe del video cuando está activo -->
                  <iframe
                    v-if="videoActive"
                    :src="videoEmbedUrl"
                    frameborder="0"
                    allowfullscreen
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
                  ></iframe>
                </div>
                
                <q-card-section v-if="description" class="q-pt-sm">
                  <q-item-label caption class="text-grey-8">{{ description }}</q-item-label>
                </q-card-section>
              </q-card>
            </div>
            
            <!-- Sección de información -->
            <div class="col-12 col-md-5">
              <q-card-section class="q-px-none">
                <q-item>
                  <q-item-section>
                    <q-item-label class="text-h5 text-weight-bold q-mb-lg">{{ title }}</q-item-label>
                    <q-item-label class="q-mb-md q-pr-sm" v-html="formattedContent"></q-item-label>
                  </q-item-section>
                </q-item>
                
                <!-- Enlaces a módulos -->
                <template v-if="links && links.length > 0">
                  <q-separator class="q-my-md" />
                  
                  <q-item-label header class="text-subtitle1 q-mt-lg">{{ linksTitle }}</q-item-label>
                  
                  <div class="row q-col-gutter-md q-mt-sm">
                    <div 
                      v-for="(link, index) in links" 
                      :key="index"
                      class="col-12 col-sm-6"
                    >
                      <q-btn
                        :to="link.url"
                        color="primary"
                        class="full-width text-weight-medium q-py-sm"
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

// Props específicos del componente o valores por defecto
const title = computed(() => props.content.title || 'Módulos de CERTIFFY');
const videoUrl = computed(() => props.content.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
const thumbnailUrl = computed(() => props.content.thumbnailUrl || '');
const description = computed(() => props.content.description || '(Video de generalidades donde se habla sobre los 3 módulos de certiffy)');
const richText = computed(() => props.content.richText || '<p>Con este módulo, puede generar órdenes de corte y gestionar todo el proceso de certificación de manera eficiente. Explore las diferentes funcionalidades disponibles a través de los enlaces a continuación.</p>');
const links = computed(() => props.content.links || [
  { label: 'Trazabilidad', url: '/trazabilidad' },
  { label: 'Administración', url: '/administracion' },
  { label: 'Certificación', url: '/certificacion' }
]);
const linksTitle = computed(() => props.content.linksTitle || 'Módulos disponibles');

// Imagen de respaldo
const placeholderImage = 'https://placehold.co/800x450/e0f2f1/00796b?text=Video+CERTIFFY';

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
