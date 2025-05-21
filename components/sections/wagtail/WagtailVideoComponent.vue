<template>
  <div class="wagtail-video-component">
    <q-card flat bordered class="video-card">
      <q-card-section class="video-container">
        <!-- Cargando video -->
        <div v-if="loading" class="video-loading">
          <q-spinner color="primary" size="3em" />
          <div class="q-mt-sm">Cargando video...</div>
        </div>
        
        <!-- Error al cargar video -->
        <div v-else-if="error" class="video-error">
          <q-icon name="error_outline" color="negative" size="2em" />
          <div class="q-mt-sm">{{ error }}</div>
          <q-btn 
            v-if="videoUrl" 
            outline 
            color="primary" 
            class="q-mt-md" 
            icon="open_in_new" 
            :href="videoUrl" 
            target="_blank"
            label="Ver en sitio original"
          />
        </div>
        
        <!-- Video embebido -->
        <div v-else-if="embedUrl" class="video-embed">
          <q-responsive :ratio="16/9">
            <iframe 
              :src="embedUrl" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </q-responsive>
        </div>
        
        <!-- Video no disponible -->
        <div v-else class="video-placeholder">
          <q-icon name="videocam_off" size="3rem" color="grey-7" />
          <div class="q-mt-sm text-subtitle1">Video no disponible</div>
          <div class="q-mt-xs text-caption text-grey-7">
            No se ha proporcionado una URL de video válida o el video no está disponible en este momento.
          </div>
        </div>
      </q-card-section>
      
      <!-- Leyenda del video -->
      <q-card-section v-if="videoCaption" class="video-caption q-pt-none">
        <q-separator spaced />
        <div class="text-caption text-italic text-grey-8">
          {{ videoCaption }}
        </div>
      </q-card-section>
      
      <!-- Controles adicionales -->
      <q-card-actions v-if="videoUrl" align="right">
        <q-btn 
          flat 
          dense 
          color="primary" 
          icon="open_in_new" 
          :href="videoUrl" 
          target="_blank"
          label="Ver original"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  content: {
    type: Object,
    default: () => ({
      url: 'https://www.youtube.com/watch?v=X6dM7OjHNsE',
      caption: 'Video de ejemplo',
      id: 'video-sample'
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});

const loading = ref(false);
const error = ref(null);
const embedUrl = ref(null);

// Obtener la URL del video
const videoUrl = computed(() => {
  // Manejar diferentes estructuras de datos posibles
  if (props.content.url) {
    return props.content.url;
  }
  
  if (props.content.video && props.content.video.url) {
    return props.content.video.url;
  }
  
  if (props.content.value && props.content.value.url) {
    return props.content.value.url;
  }
  
  return null;
});

// Obtener la leyenda del video
const videoCaption = computed(() => {
  if (props.content.caption) {
    return props.content.caption;
  }
  
  if (props.content.video && props.content.video.caption) {
    return props.content.video.caption;
  }
  
  if (props.content.value && props.content.value.caption) {
    return props.content.value.caption;
  }
  
  return null;
});

// Convertir URL de video a URL de embed
const getEmbedUrl = (url) => {
  if (!url) return null;
  
  try {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      
      if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v');
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const vimeoRegex = /vimeo\.com\/(\d+)/;
      const match = url.match(vimeoRegex);
      
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}`;
      }
    }
    
    // Si no es YouTube ni Vimeo, devolver null
    return null;
  } catch (err) {
    console.error('Error al procesar URL de video:', err);
    return null;
  }
};

// Procesar la URL del video al montar el componente
onMounted(() => {
  loading.value = true;
  error.value = null;
  
  try {
    if (!videoUrl.value) {
      throw new Error('URL de video no disponible');
    }
    
    const embed = getEmbedUrl(videoUrl.value);
    
    if (!embed) {
      throw new Error('No se pudo generar la URL de embed para este video');
    }
    
    embedUrl.value = embed;
  } catch (err) {
    console.error('Error al procesar video:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<style>
.wagtail-video-component {
  margin: 0;
}

.video-card {
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  border-radius: 8px !important;
}

.video-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.video-container {
  position: relative;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.video-embed {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.video-embed iframe {
  border: none;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.video-loading,
.video-error,
.video-placeholder {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.video-loading {
  color: var(--q-primary-color, #1976d2);
}

.video-error {
  color: var(--q-negative-color, #C10015);
  background-color: rgba(193, 0, 21, 0.05);
  border-radius: 4px;
}

.video-placeholder {
  color: #666;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.video-caption {
  font-style: italic;
  color: #666;
}

/* Responsive */
@media (max-width: 599px) {
  .video-loading,
  .video-error,
  .video-placeholder {
    min-height: 180px;
    padding: 1rem;
  }
}
</style>
