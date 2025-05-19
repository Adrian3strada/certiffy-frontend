<template>
  <div class="content-component">
    <div class="container q-pa-md">
      <div class="row q-col-gutter-md" :class="{ 'reverse': content.layout === 'image-text' }">
        <div class="col-12 col-md-6">
          <h2 class="text-h4 q-mb-md">{{ content.title }}</h2>
          <div v-html="content.body"></div>
        </div>
        <div class="col-12 col-md-6" v-if="content.image">
          <img :src="content.image" class="content-image" alt="Imagen de contenido">
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
      title: 'Título de contenido',
      body: '<p>Este es un bloque de contenido. Puedes editarlo para añadir tu propio texto.</p>',
      image: '',
      layout: 'text-image'
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.content-component {
  width: 100%;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.content-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.reverse {
  flex-direction: row-reverse;
}
</style>
