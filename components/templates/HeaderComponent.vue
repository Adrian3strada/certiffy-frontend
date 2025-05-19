<template>
  <div class="header-component" :class="{ 'preview-mode': isPreview }">
    <div class="container">
      <div class="row items-center">
        <div class="col-auto q-mr-md" v-if="content.logo">
          <img :src="content.logo" alt="Logo" class="logo" />
        </div>
        <div class="col">
          <h1 class="q-my-none">{{ content.title || 'Título del Sitio' }}</h1>
          <p v-if="content.subtitle" class="q-my-sm subtitle">{{ content.subtitle }}</p>
        </div>
        <div class="col-auto">
          <q-tabs v-if="content.menuItems && content.menuItems.length" align="right">
            <q-tab 
              v-for="(item, index) in content.menuItems" 
              :key="index" 
              :label="item.text" 
              :to="isPreview ? item.url : '#'" 
            />
          </q-tabs>
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
      title: 'Título del Sitio',
      subtitle: '',
      logo: null,
      menuItems: []
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
  padding: 1rem 0;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.preview-mode {
  cursor: default;
}

.logo {
  max-height: 50px;
  max-width: 150px;
}

.subtitle {
  color: #666;
  font-size: 0.9rem;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}
</style>
