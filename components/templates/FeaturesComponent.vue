<template>
  <div class="features-component" :class="{ 'preview-mode': isPreview }">
    <div class="container">
      <h2 v-if="content.title" class="q-mt-md q-mb-lg text-center">{{ content.title }}</h2>
      
      <div class="row q-col-gutter-md">
        <div 
          v-for="(item, index) in content.items || []" 
          :key="index" 
          class="col-12 col-md-4 col-lg-3"
        >
          <q-card class="feature-card">
            <q-card-section class="text-center">
              <q-icon :name="item.icon || 'mdi-check'" color="primary" size="3rem" />
              <h3 class="q-mt-md q-mb-sm">{{ item.title }}</h3>
              <p class="q-ma-none">{{ item.description }}</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  content: {
    type: Object,
    default: () => ({
      title: 'Nuestras Características',
      items: [
        { title: 'Característica 1', description: 'Descripción 1', icon: 'mdi-check' },
        { title: 'Característica 2', description: 'Descripción 2', icon: 'mdi-check' }
      ]
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.features-component {
  padding: 3rem 0;
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

.feature-card {
  height: 100%;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}
</style>
