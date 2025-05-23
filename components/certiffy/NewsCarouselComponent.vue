<template>
  <section class="q-py-xl q-px-md">
    <div class="q-mx-auto" style="max-width: 1200px">
      <div class="text-center q-mb-xl">
        <div class="text-h4 text-weight-bold">{{ title }}</div>
      </div>
      
      <q-card flat bordered class="q-mb-lg shadow-2">
        <q-carousel
          v-model="slide"
          animated
          arrows
          navigation
          infinite
          swipeable
          control-color="primary"
          control-type="unelevated"
          control-text-color="white"
          navigation-icon="circle"
          padding
          class="bg-white rounded-borders"
          :autoplay="autoplay"
          @mouseenter="autoplay = false"
          @mouseleave="autoplay = 5000"
          height="400px"
        >
          <q-carousel-slide v-for="(item, index) in items" :key="index" :name="index" class="column no-wrap">
            <div class="q-pa-md full-height">
              <div class="row items-center justify-evenly q-col-gutter-md full-height">
                <!-- Imagen o thumbnail de video -->
                <div class="col-12 col-md-6">
                  <q-card class="overflow-hidden">
                    <q-img 
                      :src="item.image" 
                      :ratio="16/9"
                      spinner-color="primary"
                      spinner-size="40px"
                    >
                      <div v-if="item.videoUrl" class="absolute-center">
                        <q-btn
                          round
                          unelevated
                          color="primary"
                          icon="play_arrow"
                          size="lg"
                          @click.stop="openVideo(item.videoUrl)" 
                        />
                      </div>
                    </q-img>
                    <q-card-section v-if="item.videoLabel" class="q-pt-xs text-center text-caption">
                      {{ item.videoLabel }}
                    </q-card-section>
                  </q-card>
                </div>
                
                <!-- Contenido de texto -->
                <div class="col-12 col-md-6">
                  <q-card flat bordered class="q-pa-md h-100">
                    <q-card-section>
                      <div class="text-h5 text-weight-bold q-mb-md">{{ item.title }}</div>
                      <div class="text-body1 q-mb-lg">{{ item.description }}</div>
                    </q-card-section>
                    
                    <q-card-actions vertical align="center" v-if="item.buttonLabel">
                      <q-btn 
                        color="primary" 
                        :label="item.buttonLabel" 
                        :to="item.buttonUrl"
                        unelevated
                        rounded
                        class="q-px-xl q-py-sm"
                      />
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </q-card>
    </div>
    
    <!-- Video Dialog -->
    <q-dialog v-model="videoDialog" persistent maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-dark">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6">{{ currentVideoTitle }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        
        <q-card-section class="q-pt-none flex flex-center" style="height: 90vh">
          <q-responsive style="width: 90%; max-width: 1000px;" :ratio="16/9">
            <q-iframe
              class="full-height full-width"
              :src="videoEmbedUrl"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </q-responsive>
        </q-card-section>
      </q-card>
    </q-dialog>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
});

const slide = ref(0);
const autoplay = ref(5000);
const videoDialog = ref(false);
const currentVideoTitle = ref('');

// URL de vídeo embebida para el diálogo
const videoEmbedUrl = computed(() => {
  if (!props.items[slide.value]?.videoUrl) return '';
  
  const url = props.items[slide.value].videoUrl;
  
  // Convertir URL de YouTube a URL embebida
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

// Función para abrir el video en un dialog
const openVideo = (url) => {
  if (!url) return;
  currentVideoTitle.value = props.items[slide.value].title || 'Video';
  videoDialog.value = true;
};
</script>
