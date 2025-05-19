<template>
  <div class="cta-component" :style="{ backgroundColor: content.bgColor, color: content.textColor }">
    <div class="container q-pa-md">
      <div class="row items-center justify-center text-center">
        <div class="col-12 col-md-8">
          <h2 class="text-h4 q-mb-md">{{ content.title }}</h2>
          <p class="q-mb-lg">{{ content.description }}</p>
          <q-btn 
            :label="content.buttonText" 
            :to="content.buttonUrl" 
            color="white" 
            text-color="primary" 
            unelevated 
            size="lg" 
            class="cta-button"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  content: {
    type: Object,
    default: () => ({
      title: 'Llamada a la acción',
      description: 'Descripción de la llamada a la acción',
      buttonText: 'Haz clic aquí',
      buttonUrl: '#',
      bgColor: '#4caf50',
      textColor: '#ffffff'
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
  width: 100%;
  padding: 3rem 0;
  border-radius: 4px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.cta-button {
  min-width: 150px;
  font-weight: bold;
}
</style>
