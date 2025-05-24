<template>
  <div class="api-video-component">
    <q-card flat bordered class="video-card" :class="{ 'q-my-md': !noMargin }">
      <q-card-section class="video-container">
        <!-- Cargando video -->
        <div v-if="loading" class="video-loading">
          <q-spinner :color="spinnerColor" :size="spinnerSize" />
          <div class="q-mt-sm">{{ loadingText }}</div>
        </div>
        
        <!-- Error al cargar video -->
        <div v-else-if="error" class="video-error">
          <q-icon name="error_outline" color="negative" :size="errorIconSize" />
          <div class="q-mt-sm">{{ error }}</div>
          <q-btn 
            v-if="videoUrl" 
            outline 
            color="primary" 
            class="q-mt-md" 
            icon="open_in_new" 
            :href="videoUrl" 
            target="_blank"
            :label="externalLinkText"
          />
        </div>
        
        <!-- Video embebido -->
        <div v-else-if="embedUrl" class="video-embed">
          <q-responsive :ratio="aspectRatio">
            <iframe 
              :src="embedUrl" 
              frameborder="0" 
              :allow="iframePermissions" 
              allowfullscreen
            ></iframe>
          </q-responsive>
        </div>
        
        <!-- Video no disponible -->
        <div v-else class="video-placeholder">
          <q-icon name="videocam_off" :size="placeholderIconSize" color="grey-7" />
          <div class="q-mt-sm text-subtitle1">{{ noVideoText }}</div>
          <div class="q-mt-xs text-caption text-grey-7">
            {{ noVideoDescription }}
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
      <q-card-actions v-if="showControls && videoUrl" :align="controlsAlignment">
        <q-btn 
          flat 
          dense 
          :color="controlsColor" 
          icon="open_in_new" 
          :href="videoUrl" 
          target="_blank"
          :label="controlsLabel"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  // Datos del video (puede ser un objeto con diferentes estructuras)
  videoData: {
    type: Object,
    required: true
  },
  // Opciones de personalización
  aspectRatio: {
    type: Number,
    default: 16/9
  },
  spinnerColor: {
    type: String,
    default: 'primary'
  },
  spinnerSize: {
    type: String,
    default: '3em'
  },
  errorIconSize: {
    type: String,
    default: '2em'
  },
  placeholderIconSize: {
    type: String,
    default: '3rem'
  },
  loadingText: {
    type: String,
    default: 'Cargando video...'
  },
  noVideoText: {
    type: String,
    default: 'Video no disponible'
  },
  noVideoDescription: {
    type: String,
    default: 'No se ha proporcionado una URL de video válida o el video no está disponible en este momento.'
  },
  externalLinkText: {
    type: String,
    default: 'Ver en sitio original'
  },
  showControls: {
    type: Boolean,
    default: true
  },
  controlsAlignment: {
    type: String,
    default: 'right'
  },
  controlsColor: {
    type: String,
    default: 'primary'
  },
  controlsLabel: {
    type: String,
    default: 'Ver original'
  },
  iframePermissions: {
    type: String,
    default: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
  },
  noMargin: {
    type: Boolean,
    default: false
  }
});

// Emitir eventos
const emit = defineEmits(['video-loaded', 'video-error']);

const loading = ref(true);
const error = ref(null);
const embedUrl = ref(null);

// Obtener la URL del video
const videoUrl = computed(() => {
  // Manejar diferentes estructuras de datos posibles
  if (props.videoData.video_url) {
    return props.videoData.video_url;
  }
  
  if (props.videoData.url) {
    return props.videoData.url;
  }
  
  if (props.videoData.value && props.videoData.value.video_url) {
    return props.videoData.value.video_url;
  }
  
  if (props.videoData.value && props.videoData.value.url) {
    return props.videoData.value.url;
  }
  
  return null;
});

// Obtener la leyenda del video
const videoCaption = computed(() => {
  if (props.videoData.caption) {
    return props.videoData.caption;
  }
  
  if (props.videoData.value && props.videoData.value.caption) {
    return props.videoData.value.caption;
  }
  
  return null;
});

// Convertir URL de video a URL de embed
const getEmbedUrl = (url) => {
  if (!url) return null;
  
  try {
    // Si ya es una URL de embed, devolverla directamente
    if (url.includes('/embed/')) {
      return url;
    }
    
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
    
    // Si no es YouTube ni Vimeo pero parece una URL de video, intentar usarla directamente
    if (url.includes('mp4') || url.includes('webm') || url.includes('ogg')) {
      return url;
    }
    
    // Si no es una URL de video reconocida, devolver null
    return null;
  } catch (err) {
    console.error('Error al procesar URL de video:', err);
    return null;
  }
};

// Procesar la URL del video
const processVideoUrl = () => {
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
    emit('video-loaded', { url: videoUrl.value, embedUrl: embedUrl.value });
  } catch (err) {
    console.error('Error al procesar video:', err);
    error.value = err.message;
    emit('video-error', err);
  } finally {
    loading.value = false;
  }
};

// Observar cambios en videoData para actualizar el video
watch(() => props.videoData, () => {
  processVideoUrl();
}, { deep: true });

// Procesar la URL del video al montar el componente
onMounted(() => {
  processVideoUrl();
});
</script>

<style scoped>
.api-video-component {
  width: 100%;
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
  
  .video-card {
    margin: 0.5rem 0;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .video-loading,
  .video-error,
  .video-placeholder {
    min-height: 200px;
  }
}
</style>
