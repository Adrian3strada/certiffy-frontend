<template>
  <div class="footer-component" :class="{ 'preview-mode': isPreview }">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-4">
          <p class="copyright">{{ content.copyright || '© 2025 Mi Sitio Web' }}</p>
        </div>
        
        <div class="col-12 col-md-4">
          <div v-if="content.links && content.links.length" class="footer-links">
            <a 
              v-for="(link, index) in content.links" 
              :key="index" 
              :href="isPreview ? link.url : '#'" 
              class="footer-link"
            >
              {{ link.text }}
            </a>
          </div>
        </div>
        
        <div class="col-12 col-md-4">
          <div v-if="content.socialMedia && content.socialMedia.length" class="social-links">
            <a 
              v-for="(social, index) in content.socialMedia" 
              :key="index" 
              :href="isPreview ? social.url : '#'" 
              class="social-link"
            >
              <q-icon :name="social.icon" size="md" />
            </a>
          </div>
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
      copyright: '© 2025 Mi Sitio Web',
      links: [],
      socialMedia: []
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
  padding: 2rem 0;
  background-color: #f5f5f5;
  color: #333;
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

.copyright {
  margin: 0;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.footer-link {
  color: #333;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}

.social-links {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.social-link {
  color: #333;
  text-decoration: none;
}

@media (max-width: 767px) {
  .footer-component {
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
    margin-top: 1rem;
  }
  
  .copyright {
    margin-bottom: 1rem;
  }
}
</style>
