<template>
  <div class="wagtail-video-component">
    <div class="video-container">
      <div v-if="loading" class="video-loading">
        <q-spinner color="primary" size="3em" />
        <div class="q-mt-sm">Cargando video...</div>
      </div>
      
      <div v-else-if="error" class="video-error">
        <q-icon name="mdi-alert-circle" color="negative" size="2em" />
        <div class="q-mt-sm">{{ error }}</div>
      </div>
      
      <div v-else-if="embedUrl" class="video-embed">
        <iframe 
          :src="embedUrl" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
        ></iframe>
      </div>
      
      <div v-else class="video-placeholder">
        <q-icon name="mdi-video" size="3rem" color="grey-7" />
        <div class="q-mt-sm">Video no disponible</div>
      </div>
    </div>
    
    <div v-if="videoCaption" class="video-caption">
      {{ videoCaption }}
    </div>
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

<style scoped>
.wagtail-video-component {
  margin: 1.5rem 0;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
  border-radius: 4px;
  background-color: #000;
}

.video-container iframe,
.video-loading,
.video-error,
.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.video-loading {
  background-color: #f5f5f5;
  color: #666;
}

.video-error {
  background-color: #ffebee;
  color: #c62828;
  text-align: center;
  padding: 1rem;
}

.video-placeholder {
  background-color: #f0f0f0;
  color: #666;
}

.video-caption {
  margin-top: 0.75rem;
  text-align: center;
  font-style: italic;
  color: #666;
  font-size: 0.9rem;
}
</style>
