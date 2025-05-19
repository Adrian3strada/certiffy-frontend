<template>
  <div class="gallery-component" :class="{ 'preview-mode': isPreview }">
    <div class="container">
      <h2 v-if="content.title" class="q-mt-md q-mb-lg text-center">{{ content.title }}</h2>
      
      <div class="row q-col-gutter-md">
        <div 
          v-for="(image, index) in content.images || []" 
          :key="index" 
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-img
            :src="image.url"
            :ratio="1"
            class="gallery-image"
            fit="cover"
          >
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                <q-icon name="mdi-image-off" size="3rem" />
              </div>
            </template>
          </q-img>
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
      title: 'Galería',
      images: []
    })
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.gallery-component {
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

.gallery-image {
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.gallery-image:hover {
  transform: scale(1.05);
}
</style>
