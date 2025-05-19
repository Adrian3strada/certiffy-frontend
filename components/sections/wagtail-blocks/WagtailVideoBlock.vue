<template>
  <div class="wagtail-video-block">
    <div class="video-container">
      <iframe 
        v-if="embedUrl"
        :src="embedUrl" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
        class="video-iframe"
      ></iframe>
      <div v-else class="video-placeholder">
        <q-icon name="mdi-video-off" size="3rem" color="grey" />
        <div class="q-mt-sm">Video no disponible</div>
      </div>
    </div>
    <div v-if="caption" class="caption">{{ caption }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

// Extraer datos del video
const videoUrl = computed(() => {
  if (!props.data || !props.data.value) return '';
  return props.data.value.url || '';
});

const caption = computed(() => {
  if (!props.data || !props.data.value) return '';
  return props.data.value.caption || '';
});

// Convertir URL de video a URL de incrustación
const embedUrl = computed(() => {
  const url = videoUrl.value;
  if (!url) return '';
  
  // YouTube
  if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(new URL(url).search);
    const videoId = urlParams.get('v');
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // YouTube (formato corto)
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Vimeo
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1].split('?')[0];
    if (videoId) return `https://player.vimeo.com/video/${videoId}`;
  }
  
  return '';
});
</script>

<style scoped>
.wagtail-video-block {
  margin: 1.5rem 0;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
  border-radius: 4px;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
}

.caption {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}
</style>
