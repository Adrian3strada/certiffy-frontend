<template>
  <div 
    class="cta-component" 
    :class="{ 'preview-mode': isPreview }"
    :style="{ backgroundColor: content.backgroundColor || '#f5f5f5' }"
  >
    <div class="container">
      <div class="cta-content">
        <h2 class="q-my-md">{{ content.title || 'Actúa Ahora' }}</h2>
        <p class="q-mb-lg">{{ content.text || 'No esperes más para comenzar' }}</p>
        <q-btn 
          v-if="content.buttonText" 
          :label="content.buttonText" 
          color="primary" 
          size="lg" 
          :to="isPreview ? content.buttonUrl : '#'" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  content: {
    type: Object,
    default: () => ({
      title: 'Actúa Ahora',
      text: 'No esperes más para comenzar',
      buttonText: 'Comenzar',
      buttonUrl: '#',
      backgroundColor: '#f5f5f5'
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.cta-component {
  padding: 4rem 0;
  text-align: center;
}

.preview-mode {
  cursor: default;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
}
</style>
