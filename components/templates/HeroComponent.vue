<template>
  <div 
    class="hero-component" 
    :class="{ 'preview-mode': isPreview }"
    :style="backgroundStyle"
  >
    <div class="hero-overlay"></div>
    <div class="container">
      <div class="hero-content">
        <h1 class="hero-title">{{ content.title || 'Título Principal' }}</h1>
        <p v-if="content.subtitle" class="hero-subtitle">{{ content.subtitle }}</p>
        <q-btn 
          v-if="content.buttonText" 
          :label="content.buttonText" 
          color="primary" 
          :to="isPreview ? content.buttonUrl : '#'" 
          class="q-mt-md"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  content: {
    type: Object,
    default: () => ({
      title: 'Título Principal',
      subtitle: 'Subtítulo del banner',
      backgroundImage: null,
      buttonText: 'Saber más',
      buttonUrl: '#'
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});

// Estilo del fondo según la imagen proporcionada
const backgroundStyle = computed(() => {
  if (props.content.backgroundImage) {
    return {
      backgroundImage: `url(${props.content.backgroundImage})`
    };
  }
  return {
    backgroundColor: '#1976D2'
  };
});
</script>

<style scoped>
.hero-component {
  position: relative;
  height: 400px;
  background-size: cover;
  background-position: center;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
}

.preview-mode {
  cursor: default;
}

.container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 767px) {
  .hero-component {
    height: 300px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
}
</style>
