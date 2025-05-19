<template>
  <div class="footer-component" :style="{ backgroundColor: content.bgColor, color: content.textColor }">
    <div class="container q-pa-md">
      <div class="row items-center">
        <div class="col-12 text-center">
          <p class="copyright">{{ content.copyright }}</p>
          <div class="links q-mt-sm">
            <a 
              v-for="(link, index) in content.links" 
              :key="index" 
              :href="link.url" 
              class="footer-link q-mx-sm"
              :style="{ color: content.textColor }"
            >
              {{ link.text }}
            </a>
          </div>
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
      copyright: '© 2025 Mi Empresa',
      links: [
        { text: 'Inicio', url: '/' },
        { text: 'Acerca de', url: '/about' },
        { text: 'Contacto', url: '/contact' }
      ],
      bgColor: '#333333',
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
.footer-component {
  width: 100%;
  padding: 2rem 0;
  border-radius: 4px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-link {
  text-decoration: none;
  transition: opacity 0.3s;
}

.footer-link:hover {
  opacity: 0.8;
}
</style>
