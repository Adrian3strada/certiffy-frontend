<template>
  <div class="header-component" :style="{ backgroundColor: content.bgColor, color: content.textColor }">
    <div class="container q-pa-md">
      <div class="row items-center">
        <div class="col-12 text-center">
          <h1 class="text-h3 q-mb-sm">{{ content.title }}</h1>
          <p class="text-subtitle1">{{ content.subtitle }}</p>
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
      title: 'Título del encabezado',
      subtitle: 'Subtítulo del encabezado',
      bgColor: '#f5f5f5',
      textColor: '#333333'
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.header-component {
  width: 100%;
  padding: 2rem 0;
  border-radius: 4px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
